import assert from "node:assert/strict";
import { test } from "node:test";

import type { AnimalManagement } from "@/domain/models/AnimalManagement";
import type { IAnimalRepository } from "@/domain/repositories/IAnimalRepository";
import type { IAuthRepository } from "@/domain/repositories/IAuthRepository";
import type { IFoundationMembershipRepository } from "@/domain/repositories/IFoundationMembershipRepository";
import { CreateAnimalUseCase } from "@/domain/usecases/animals/CreateAnimalUseCase";
import type { UploadPublicImageUseCase } from "@/domain/usecases/storage/UploadPublicImageUseCase";

test("CreateAnimalUseCase uploads file photos and persists photo URLs", async () => {
  let createdAnimalParams: Parameters<IAnimalRepository["createAnimal"]>[0] | null = null;
  let updatedAnimalParams: Parameters<IAnimalRepository["updateAnimal"]>[0] | null = null;
  let createdPhotos: Parameters<IAnimalRepository["createAnimalPhotos"]>[0] | null = null;
  let uploadParams: Parameters<UploadPublicImageUseCase["execute"]>[0] | null = null;

  const animalRepository: IAnimalRepository = {
    getHomeAnimals: async () => ({ urgent: [], sponsored: [], recent: [] }),
    getAnimals: async () => ({ animals: [], total: 0 }),
    getAnimalsCount: async () => 0,
    getRecentAnimals: async () => [],
    getAnimalsInTreatment: async () => [],
    createAnimal: async (params) => {
      createdAnimalParams = params;
      return {
        id: 101,
        name: params.name,
        species: params.species,
        breed: params.breed ?? "",
        sex: params.sex,
        ageMonths: params.ageMonths,
        size: params.size,
        status: params.status,
        coverImageUrl: params.coverImageUrl ?? null,
        createdAt: new Date().toISOString(),
      } satisfies AnimalManagement;
    },
    createAnimalPhotos: async (params) => {
      createdPhotos = params;
    },
    deleteAnimal: async () => {},
    deleteAnimalPhotos: async () => {},
    getAnimalById: async () => {
      throw new Error("not-used");
    },
    updateAnimal: async (params) => {
      updatedAnimalParams = params;
    },
    replaceAnimalPhotos: async () => {},
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
      return "https://cdn.test/animals/101/photo.png";
    },
  } as UploadPublicImageUseCase;

  const useCase = new CreateAnimalUseCase(
    animalRepository,
    authRepository,
    foundationMembershipRepository,
    uploadPublicImageUseCase,
  );

  const file = { name: "photo.png", size: 256_000, type: "image/png" } as File;

  const result = await useCase.execute({
    name: "Simba",
    species: "dog",
    breed: "Labrador",
    sex: "male",
    age: 3,
    ageUnit: "years",
    size: "medium",
    status: "available",
    description: "Friendly dog ready for adoption.",
    photos: [file, "https://cdn.test/animals/legacy.png"],
    isPublished: true,
  });

  assert.equal(createdAnimalParams?.foundationId, "foundation-1");
  assert.equal(createdAnimalParams?.coverImageUrl, null);
  assert.deepEqual(uploadParams, {
    file,
    type: "animal",
    foundationId: "foundation-1",
    entityId: "101",
  });
  assert.equal(updatedAnimalParams?.coverImageUrl, "https://cdn.test/animals/101/photo.png");
  assert.deepEqual(createdPhotos, [
    { animalId: 101, url: "https://cdn.test/animals/101/photo.png", sortOrder: 0 },
    { animalId: 101, url: "https://cdn.test/animals/legacy.png", sortOrder: 1 },
  ]);
  assert.equal(result.coverImageUrl, "https://cdn.test/animals/101/photo.png");
});
