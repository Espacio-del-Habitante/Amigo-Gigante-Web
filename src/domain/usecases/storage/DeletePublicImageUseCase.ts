import type { IPublicImageStorage } from "@/domain/repositories/IPublicImageStorage";

export interface DeletePublicImageInput {
  url: string;
}

export class DeletePublicImageUseCase {
  constructor(private readonly publicImageStorage: IPublicImageStorage) {}

  async execute({ url }: DeletePublicImageInput): Promise<void> {
    try {
      await this.publicImageStorage.deleteImage(url);
    } catch {
      return;
    }
  }
}
