import type { IPublicImageStorage } from "@/domain/repositories/IPublicImageStorage";

export interface DeletePublicImageInput {
  url: string;
}

const getPublicImagePath = (url: string, bucketName: string): string | null => {
  try {
    const parsedUrl = new URL(url);
    const publicPath = `/storage/v1/object/public/${bucketName}/`;
    const pathname = parsedUrl.pathname;
    const index = pathname.indexOf(publicPath);

    if (index === -1) {
      return null;
    }

    const path = pathname.slice(index + publicPath.length);
    const cleanedPath = path.split("?")[0]?.split("#")[0] ?? "";

    if (!cleanedPath.startsWith("products/") || cleanedPath.length === 0) {
      return null;
    }

    return decodeURIComponent(cleanedPath);
  } catch {
    return null;
  }
};

export class DeletePublicImageUseCase {
  constructor(
    private readonly publicImageStorage: IPublicImageStorage,
    private readonly bucketName: string,
  ) {}

  async execute({ url }: DeletePublicImageInput): Promise<void> {
    const path = getPublicImagePath(url, this.bucketName);

    if (!path) {
      return;
    }

    await this.publicImageStorage.deleteImage(path);
  }
}
