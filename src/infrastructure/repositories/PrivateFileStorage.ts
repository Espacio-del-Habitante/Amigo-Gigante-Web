import type {
  GetPrivateFileUrlParams,
  IPrivateFileStorage,
  UploadPrivateFileParams,
} from "@/domain/repositories/IPrivateFileStorage";
import {
  PRIVATE_FILE_ALLOWED_TYPES,
  PRIVATE_FILE_MAX_SIZE_BYTES,
} from "@/domain/repositories/IPrivateFileStorage";
import { getPrivateFilesBucket } from "@/infrastructure/config/environment";
import { supabaseClient } from "@/infrastructure/config/supabase";

const STORAGE_TYPE_PATH: Record<UploadPrivateFileParams["type"], string> = {
  "adoption-request": "adoption-requests",
};

class PrivateFileStorage implements IPrivateFileStorage {
  async uploadFile(params: UploadPrivateFileParams): Promise<string> {
    this.validateFile(params.file);
    const filePath = this.buildPath(params);
    const bucketName = getPrivateFilesBucket();

    const { data, error } = await supabaseClient.storage.from(bucketName).upload(filePath, params.file, {
      upsert: false,
    });

    if (error) {
      throw new Error(this.translateStorageError(error, "upload"));
    }

    return data?.path ?? filePath;
  }

  async getSignedUrl({ filePath, expiresIn = 3600 }: GetPrivateFileUrlParams): Promise<string> {
    const bucketName = getPrivateFilesBucket();
    const { data, error } = await supabaseClient.storage.from(bucketName).createSignedUrl(filePath, expiresIn);

    if (error) {
      throw new Error(this.translateStorageError(error, "url"));
    }

    if (!data?.signedUrl) {
      throw new Error("storage.private.url.error.generating");
    }

    return data.signedUrl;
  }

  private validateFile(file: File): void {
    if (!file || file.size === 0) {
      throw new Error("storage.private.validation.empty");
    }

    if (file.size > PRIVATE_FILE_MAX_SIZE_BYTES) {
      throw new Error("storage.private.validation.maxSize");
    }

    if (!PRIVATE_FILE_ALLOWED_TYPES.has(file.type)) {
      throw new Error("storage.private.validation.invalidType");
    }
  }

  private buildPath(params: UploadPrivateFileParams): string {
    const basePath = STORAGE_TYPE_PATH[params.type];
    const sanitizedName = this.sanitizeFileName(params.file.name);
    const timestamp = Date.now();
    return `${basePath}/${params.foundationId}/${params.requestId}/${params.docType}-${timestamp}-${sanitizedName}`;
  }

  private sanitizeFileName(fileName: string): string {
    return fileName.replace(/[^a-z0-9.\-_]/gi, "-").toLowerCase();
  }

  private translateStorageError(error: { message?: string }, context: "upload" | "url"): string {
    const message = error.message?.toLowerCase?.() ?? "";

    if (message.includes("permission") || message.includes("row level")) {
      return "storage.private.upload.error.accessDenied";
    }

    if (message.includes("network") || message.includes("connection") || message.includes("failed to fetch")) {
      return "storage.private.connection";
    }

    if (context === "url") {
      return "storage.private.url.error.generating";
    }

    return "storage.private.upload.error.generic";
  }
}

export { PrivateFileStorage };
