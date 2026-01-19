import assert from "node:assert/strict";
import { test } from "node:test";

import type { FoundationProfile } from "@/domain/models/FoundationProfile";
import type { IFoundationProfileRepository } from "@/domain/repositories/IFoundationProfileRepository";
import type { IPublicImageStorage } from "@/domain/repositories/IPublicImageStorage";
import { UpdateFoundationProfileUseCase } from "@/domain/usecases/foundation/UpdateFoundationProfileUseCase";
import { DeletePublicImageUseCase } from "@/domain/usecases/storage/DeletePublicImageUseCase";
import { UploadPublicImageUseCase } from "@/domain/usecases/storage/UploadPublicImageUseCase";

test("UpdateFoundationProfileUseCase uploads a new logo and deletes the previous one", async () => {
  const calls: { deleteUrls: string[]; uploaded?: string } = { deleteUrls: [] };
  const storage: IPublicImageStorage = {
    uploadImage: async () => {
      calls.uploaded = "https://cdn.test/new-logo.png";
      return calls.uploaded;
    },
    deleteImage: async (url) => {
      calls.deleteUrls.push(url);
    },
  };

  const currentProfile: FoundationProfile = {
    foundationId: "foundation-1",
    name: "Amigo",
    description: "desc",
    logoUrl: "https://cdn.test/old-logo.png",
    city: "City",
    country: "Country",
    address: "Address",
    publicEmail: "test@example.com",
    publicPhone: "555-1234",
    instagramUrl: "",
    whatsappUrl: "",
  };

  let updatedProfile: FoundationProfile | null = null;
  const repository: IFoundationProfileRepository = {
    getFoundationProfile: async () => currentProfile,
    updateFoundationProfile: async (profile) => {
      updatedProfile = profile;
      return profile;
    },
  };

  const useCase = new UpdateFoundationProfileUseCase(
    repository,
    new UploadPublicImageUseCase(storage),
    new DeletePublicImageUseCase(storage),
  );

  const logoFile = { name: "logo.png", size: 512_000, type: "image/png" } as File;
  const result = await useCase.execute({
    ...currentProfile,
    logoFile,
  });

  assert.equal(result.logoUrl, "https://cdn.test/new-logo.png");
  assert.deepEqual(calls.deleteUrls, ["https://cdn.test/old-logo.png"]);
  assert.equal(updatedProfile?.logoUrl, "https://cdn.test/new-logo.png");
});

test("UpdateFoundationProfileUseCase clears logo when requested", async () => {
  const calls: { deleteUrls: string[]; uploadCalled: boolean } = {
    deleteUrls: [],
    uploadCalled: false,
  };
  const storage: IPublicImageStorage = {
    uploadImage: async () => {
      calls.uploadCalled = true;
      return "https://cdn.test/logo.png";
    },
    deleteImage: async (url) => {
      calls.deleteUrls.push(url);
    },
  };

  const currentProfile: FoundationProfile = {
    foundationId: "foundation-1",
    name: "Amigo",
    description: "desc",
    logoUrl: "https://cdn.test/old-logo.png",
    city: "City",
    country: "Country",
    address: "Address",
    publicEmail: "test@example.com",
    publicPhone: "555-1234",
    instagramUrl: "",
    whatsappUrl: "",
  };

  let updatedProfile: FoundationProfile | null = null;
  const repository: IFoundationProfileRepository = {
    getFoundationProfile: async () => currentProfile,
    updateFoundationProfile: async (profile) => {
      updatedProfile = profile;
      return profile;
    },
  };

  const useCase = new UpdateFoundationProfileUseCase(
    repository,
    new UploadPublicImageUseCase(storage),
    new DeletePublicImageUseCase(storage),
  );

  const result = await useCase.execute({
    ...currentProfile,
    logoUrl: null,
  });

  assert.equal(result.logoUrl, null);
  assert.deepEqual(calls.deleteUrls, ["https://cdn.test/old-logo.png"]);
  assert.equal(calls.uploadCalled, false);
  assert.equal(updatedProfile?.logoUrl, null);
});
