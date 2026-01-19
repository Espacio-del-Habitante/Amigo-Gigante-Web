import type { IPublicImageStorage, UploadPublicImageParams } from "@/domain/repositories/IPublicImageStorage";
import { validatePublicImageFile } from "@/domain/usecases/storage/publicImageValidation";

export class UploadPublicImageUseCase {
  constructor(private readonly publicImageStorage: IPublicImageStorage) {}

  async execute(params: UploadPublicImageParams): Promise<string> {
    validatePublicImageFile(params.file);
    return this.publicImageStorage.uploadImage(params);
  }
}
