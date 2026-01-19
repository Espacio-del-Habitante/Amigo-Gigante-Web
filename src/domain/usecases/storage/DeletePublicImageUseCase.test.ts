import assert from "node:assert/strict";
import { test } from "node:test";

import type { IPublicImageStorage } from "@/domain/repositories/IPublicImageStorage";
import { DeletePublicImageUseCase } from "@/domain/usecases/storage/DeletePublicImageUseCase";

test("DeletePublicImageUseCase deletes valid product images", async () => {
  let deletedPath: string | null = null;

  const publicImageStorage: IPublicImageStorage = {
    uploadImage: async () => {
      throw new Error("not-used");
    },
    deleteImage: async (path) => {
      deletedPath = path;
    },
  };

  const useCase = new DeletePublicImageUseCase(publicImageStorage, "amg-public-image");

  await useCase.execute({
    url: "https://project.supabase.co/storage/v1/object/public/amg-public-image/products/foundation-1/123.png",
  });

  assert.equal(deletedPath, "products/foundation-1/123.png");
});

test("DeletePublicImageUseCase ignores external or non-product URLs", async () => {
  let deleteCalls = 0;

  const publicImageStorage: IPublicImageStorage = {
    uploadImage: async () => {
      throw new Error("not-used");
    },
    deleteImage: async () => {
      deleteCalls += 1;
    },
  };

  const useCase = new DeletePublicImageUseCase(publicImageStorage, "amg-public-image");

  await useCase.execute({
    url: "https://example.com/images/products/foundation-1/123.png",
  });

  await useCase.execute({
    url: "https://project.supabase.co/storage/v1/object/public/amg-public-image/animals/1/photo.png",
  });

  assert.equal(deleteCalls, 0);
});
