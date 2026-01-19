import { injectable } from "inversify";

import type { IPublicImageStorage, PublicImageType, UploadPublicImageParams } from "@/domain/repositories/IPublicImageStorage";
import { validatePublicImageFile } from "@/domain/usecases/storage/publicImageValidation";
import { getPublicImageBucket } from "@/infrastructure/config/environment";
import { supabaseClient } from "@/infrastructure/config/supabase";

@injectable()
export class PublicImageStorage implements IPublicImageStorage {
  async uploadImage({ file, type, foundationId, entityId }: UploadPublicImageParams): Promise<string> {
    validatePublicImageFile(file);

    const bucketName = getPublicImageBucket();
    const path = this.generatePath(type, foundationId, entityId, file.name);

    const { data, error } = await supabaseClient.storage.from(bucketName).upload(path, file, {
      upsert: false,
    });

    if (error) {
      throw new Error(this.translateStorageError(error));
    }

    const { data: urlData } = supabaseClient.storage.from(bucketName).getPublicUrl(data?.path ?? "");
    const publicUrl = urlData?.publicUrl ?? "";

    if (!publicUrl) {
      throw new Error("storage.upload.error.generic");
    }

    return publicUrl;
  }

  async deleteImage(path: string): Promise<void> {
    const bucketName = getPublicImageBucket();
    const { error } = await supabaseClient.storage.from(bucketName).remove([path]);

    if (error) {
      throw new Error(this.translateStorageError(error));
    }
  }

  private generatePath(
    type: PublicImageType,
    foundationId: string,
    entityId: string | undefined,
    fileName: string,
  ): string {
    const sanitized = this.sanitizeFileName(fileName);
    const timestamp = Date.now();
    const basePath = `${type}s/${foundationId}`;

    if (type === "animal") {
      if (!entityId) {
        throw new Error("storage.upload.error.generic");
      }
      return `${basePath}/${entityId}/${timestamp}-${sanitized}`;
    }

    return `${basePath}/${timestamp}-${sanitized}`;
  }

  private sanitizeFileName(fileName: string): string {
    return fileName
      .replace(/[^a-z0-9.\-_]/gi, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$|^_+|_+$/g, "")
      .toLowerCase();
  }

  private translateStorageError(error: { message?: string; code?: string }): string {
    const message = error.message?.toLowerCase?.() ?? "";
    const code = error.code?.toLowerCase?.() ?? "";

    if (code === "request_entity_too_large" || message.includes("too large") || message.includes("payload")) {
      return "storage.upload.error.fileTooLarge";
    }

    if (
      message.includes("invalid") ||
      message.includes("mime") ||
      message.includes("content-type") ||
      message.includes("format")
    ) {
      return "storage.upload.error.invalidFormat";
    }

    if (message.includes("permission") || message.includes("unauthorized") || message.includes("forbidden")) {
      return "storage.upload.error.permissionDenied";
    }

    if (message.includes("network") || message.includes("connection")) {
      return "storage.upload.error.connection";
    }

    if (
      message.includes("bucket") ||
      message.includes("not found") ||
      message.includes("storage") ||
      message.includes("resource")
    ) {
      return "storage.upload.error.generic";
    }

    return "storage.upload.error.generic";
  }
}
