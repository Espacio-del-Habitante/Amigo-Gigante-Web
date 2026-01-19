import assert from "node:assert/strict";
import { test } from "node:test";

import type { IPrivateFileStorage, UploadPrivateFileParams } from "@/domain/repositories/IPrivateFileStorage";
import { PRIVATE_FILE_MAX_SIZE_BYTES } from "@/domain/repositories/IPrivateFileStorage";
import { UploadPrivateFileUseCase } from "@/domain/usecases/storage/UploadPrivateFileUseCase";

test("UploadPrivateFileUseCase uploads valid files", async () => {
  let uploadCalledWith: UploadPrivateFileParams | null = null;

  const storage: IPrivateFileStorage = {
    uploadFile: async (params) => {
      uploadCalledWith = params;
      return "adoption-requests/foundation/1/id-document-123.pdf";
    },
    getSignedUrl: async () => "signed-url",
  };

  const useCase = new UploadPrivateFileUseCase(storage);
  const file = new File(["content"], "document.pdf", { type: "application/pdf" });

  const result = await useCase.execute({
    file,
    type: "adoption-request",
    foundationId: "foundation",
    requestId: 1,
    docType: "id-document",
  });

  assert.equal(result, "adoption-requests/foundation/1/id-document-123.pdf");
  assert.ok(uploadCalledWith);
  assert.equal(uploadCalledWith?.file.name, "document.pdf");
});

test("UploadPrivateFileUseCase rejects empty files", async () => {
  const storage: IPrivateFileStorage = {
    uploadFile: async () => "path",
    getSignedUrl: async () => "signed-url",
  };

  const useCase = new UploadPrivateFileUseCase(storage);
  const file = new File([""], "empty.pdf", { type: "application/pdf" });

  await assert.rejects(() => useCase.execute({
    file,
    type: "adoption-request",
    foundationId: "foundation",
    requestId: 1,
    docType: "id-document",
  }), (error: Error) => {
    assert.equal(error.message, "storage.private.validation.empty");
    return true;
  });
});

test("UploadPrivateFileUseCase rejects invalid types and large files", async () => {
  const storage: IPrivateFileStorage = {
    uploadFile: async () => "path",
    getSignedUrl: async () => "signed-url",
  };

  const useCase = new UploadPrivateFileUseCase(storage);
  const invalidFile = new File(["content"], "document.txt", { type: "text/plain" });

  await assert.rejects(() => useCase.execute({
    file: invalidFile,
    type: "adoption-request",
    foundationId: "foundation",
    requestId: 1,
    docType: "id-document",
  }), (error: Error) => {
    assert.equal(error.message, "storage.private.validation.invalidType");
    return true;
  });

  const oversizedFile = new File(
    [new Uint8Array(PRIVATE_FILE_MAX_SIZE_BYTES + 1)],
    "big.pdf",
    { type: "application/pdf" },
  );

  await assert.rejects(() => useCase.execute({
    file: oversizedFile,
    type: "adoption-request",
    foundationId: "foundation",
    requestId: 1,
    docType: "id-document",
  }), (error: Error) => {
    assert.equal(error.message, "storage.private.validation.maxSize");
    return true;
  });
});
