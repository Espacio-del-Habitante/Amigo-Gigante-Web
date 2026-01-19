export type PrivateFileType = "adoption-request";

export const PRIVATE_FILE_ALLOWED_TYPES = new Set([
  "application/pdf",
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/gif",
  "image/webp",
]);

export const PRIVATE_FILE_MAX_SIZE_BYTES = 10 * 1024 * 1024;

export interface UploadPrivateFileParams {
  file: File;
  type: PrivateFileType;
  foundationId: string;
  requestId: number;
  docType: string;
}

export interface GetPrivateFileUrlParams {
  filePath: string;
  expiresIn?: number;
}

export interface IPrivateFileStorage {
  uploadFile(params: UploadPrivateFileParams): Promise<string>;
  getSignedUrl(params: GetPrivateFileUrlParams): Promise<string>;
}
