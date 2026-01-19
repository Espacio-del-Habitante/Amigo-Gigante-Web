export type PublicImageType = "animal" | "product" | "event" | "foundation";

export interface UploadPublicImageParams {
  file: File;
  type: PublicImageType;
  foundationId: string;
  entityId?: string;
}

export interface IPublicImageStorage {
  uploadImage(params: UploadPublicImageParams): Promise<string>;
}
