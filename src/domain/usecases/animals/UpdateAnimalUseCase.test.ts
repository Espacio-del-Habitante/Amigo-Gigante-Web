import assert from "node:assert/strict";
import { test } from "node:test";

import type { IAnimalRepository } from "@/domain/repositories/IAnimalRepository";
import type { IAuthRepository } from "@/domain/repositories/IAuthRepository";
import type { IFoundationMembershipRepository } from "@/domain/repositories/IFoundationMembershipRepository";
import { UpdateAnimalUseCase } from "@/domain/usecases/animals/UpdateAnimalUseCase";
import type { UploadPublicImageUseCase } from "@/domain/usecases/storage/UploadPublicImageUseCase";

test("UpdateAnimalUseCase uploads new files and replaces photo URLs", async () => {
  let updatedAnimalParams: Parameters<IAnimalRepository["updateAnimal"]>[0] | null = null;
  let replacedPhotos: Parameters<IAnimalRepository["replaceAnimalPhotos"]>[0] | null = null;
  let uploadParams: Parameters<UploadPublicImageUseCase["execute"]>[0] | null = null;

  const animalRepository: IAnimalRepository = {
    getHomeAnimals: async () => ({ urgent: [], sponsored: [], recent: [] }),
    getAnimals: async () => ({ animals: [], total: 0 }),
    getAnimalsCount: async () => 0,
    getRecentAnimals: async () => [],
    getAnimalsInTreatment: async () => [],
    createAnimal: async () => {
      throw new Error("not-used");
    },
    createAnimalPhotos: async () => {},
    deleteAnimal: async () => {},
    getAnimalById: async () => {
      throw new Error("not-used");
    },
    updateAnimal: async (params) => {
      updatedAnimalParams = params;
    },
    replaceAnimalPhotos: async (params) => {
      replacedPhotos = params;
    },
    getAdoptCatalog: async () => ({ items: [], total: 0 }),
    getAdoptDetail: async () => {
      throw new Error("not-used");
    },
    getRelatedAnimals: async () => [],
  };

  const authRepository: IAuthRepository = {
    signUp: async () => {
      throw new Error("not-used");
    },
    signIn: async () => {
      throw new Error("not-used");
    },
    getSession: async () => ({
      user: { id: "user-1", email: "user@example.com", role: "foundation_user" },
      session: null,
    }),
    createProfile: async () => {},
  };

  const foundationMembershipRepository: IFoundationMembershipRepository = {
    getFoundationIdForUser: async () => "foundation-1",
  };

  const uploadPublicImageUseCase: UploadPublicImageUseCase = {
    execute: async (params) => {
      uploadParams = params;
      return "https://cdn.test/animals/123/photo.png";
    },
  } as UploadPublicImageUseCase;

  const useCase = new UpdateAnimalUseCase(
    animalRepository,
    authRepository,
    foundationMembershipRepository,
    uploadPublicImageUseCase,
  );

  const file = { name: "new-photo.png", size: 256_000, type: "image/png" } as File;

  await useCase.execute({
    animalId: 123,
    name: "Luna",
    species: "cat",
    breed: "Siamese",
    sex: "female",
    age: 2,
    ageUnit: "years",
    size: "small",
    status: "available",
    description: "Friendly cat ready for adoption.",
    photos: [file, "https://cdn.test/animals/legacy.png"],
    isPublished: true,
  });

  assert.deepEqual(uploadParams, {
    file,
    type: "animal",
    foundationId: "foundation-1",
    entityId: "123",
  });
  assert.equal(updatedAnimalParams?.coverImageUrl, "https://cdn.test/animals/123/photo.png");
  assert.deepEqual(replacedPhotos, {
    animalId: 123,
    photoUrls: ["https://cdn.test/animals/123/photo.png", "https://cdn.test/animals/legacy.png"],
  });
});
