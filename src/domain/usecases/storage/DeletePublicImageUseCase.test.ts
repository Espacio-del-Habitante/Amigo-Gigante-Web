import assert from "node:assert/strict";
import { test } from "node:test";

import type { IPublicImageStorage } from "@/domain/repositories/IPublicImageStorage";
import { DeletePublicImageUseCase } from "@/domain/usecases/storage/DeletePublicImageUseCase";

test("DeletePublicImageUseCase deletes a public image by URL", async () => {
  let deletedUrl: string | null = null;

  const publicImageStorage: IPublicImageStorage = {
    uploadImage: async () => "https://cdn.test/images/photo.png",
    deleteImage: async (url) => {
      deletedUrl = url;
    },
  };

  const useCase = new DeletePublicImageUseCase(publicImageStorage);

  await useCase.execute({ url: "https://cdn.test/images/photo.png" });

  assert.equal(deletedUrl, "https://cdn.test/images/photo.png");
});

test("DeletePublicImageUseCase swallows storage errors", async () => {
  const publicImageStorage: IPublicImageStorage = {
    uploadImage: async () => "https://cdn.test/images/photo.png",
    deleteImage: async () => {
      throw new Error("storage.delete.error.generic");
    },
  };

  const useCase = new DeletePublicImageUseCase(publicImageStorage);

  await assert.doesNotReject(() => useCase.execute({ url: "https://cdn.test/images/photo.png" }));
});
