import assert from "node:assert/strict";
import { test } from "node:test";

import type { IPublicImageStorage, UploadPublicImageParams } from "@/domain/repositories/IPublicImageStorage";
import { UploadPublicImageUseCase } from "@/domain/usecases/storage/UploadPublicImageUseCase";

test("UploadPublicImageUseCase uploads images and returns the public URL", async () => {
  let capturedParams: UploadPublicImageParams | null = null;

  const publicImageStorage: IPublicImageStorage = {
    uploadImage: async (params) => {
      capturedParams = params;
      return "https://cdn.test/images/photo.png";
    },
  };

  const useCase = new UploadPublicImageUseCase(publicImageStorage);
  const file = { name: "photo.png", size: 512_000, type: "image/png" } as File;

  const result = await useCase.execute({
    file,
    type: "product",
    foundationId: "foundation-1",
  });

  assert.equal(result, "https://cdn.test/images/photo.png");
  assert.deepEqual(capturedParams, {
    file,
    type: "product",
    foundationId: "foundation-1",
  });
});

test("UploadPublicImageUseCase validates image format", async () => {
  let uploadCalled = false;

  const publicImageStorage: IPublicImageStorage = {
    uploadImage: async () => {
      uploadCalled = true;
      return "https://cdn.test/images/photo.png";
    },
  };

  const useCase = new UploadPublicImageUseCase(publicImageStorage);
  const invalidFile = { name: "photo.txt", size: 1024, type: "text/plain" } as File;

  await assert.rejects(
    () =>
      useCase.execute({
        file: invalidFile,
        type: "product",
        foundationId: "foundation-1",
      }),
    (error: Error) => {
      assert.equal(error.message, "storage.upload.error.invalidFormat");
      return true;
    },
  );

  assert.equal(uploadCalled, false);
});
