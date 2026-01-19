import type { IPrivateFileStorage, UploadPrivateFileParams } from "@/domain/repositories/IPrivateFileStorage";
import { PRIVATE_FILE_ALLOWED_TYPES, PRIVATE_FILE_MAX_SIZE_BYTES } from "@/domain/repositories/IPrivateFileStorage";

export class UploadPrivateFileUseCase {
  constructor(private readonly privateFileStorage: IPrivateFileStorage) {}

  async execute(params: UploadPrivateFileParams): Promise<string> {
    this.validateFile(params.file);
    return this.privateFileStorage.uploadFile(params);
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
}
