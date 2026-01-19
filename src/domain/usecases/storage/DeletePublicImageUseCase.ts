import type { IPublicImageStorage } from "@/domain/repositories/IPublicImageStorage";

export interface DeletePublicImageInput {
  url: string;
}

export class DeletePublicImageUseCase {
  constructor(private readonly publicImageStorage: IPublicImageStorage) {}

  async execute({ url }: DeletePublicImageInput): Promise<void> {
    try {
      await this.publicImageStorage.deleteImage(url);
    } catch (error) {
      // Log el error pero no lanzar excepción para no bloquear el flujo
      console.error("Error deleting public image:", url, error);
      // No lanzar el error para que el proceso continúe con las demás eliminaciones
    }
  }
}
