import assert from "node:assert/strict";
import { test } from "node:test";

import type { IAnimalRepository } from "@/domain/repositories/IAnimalRepository";
import type { IAuthRepository } from "@/domain/repositories/IAuthRepository";
import type { IFoundationMembershipRepository } from "@/domain/repositories/IFoundationMembershipRepository";
import { DeleteAnimalUseCase } from "@/domain/usecases/animals/DeleteAnimalUseCase";
import type { DeletePublicImageUseCase } from "@/domain/usecases/storage/DeletePublicImageUseCase";

test("DeleteAnimalUseCase deletes animal photos and storage images", async () => {
  const deletedUrls: string[] = [];
  let deleteAnimalPhotosCalled = false;
  let deleteAnimalParams: Parameters<IAnimalRepository["deleteAnimal"]>[0] | null = null;

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
    deleteAnimal: async (params) => {
      deleteAnimalParams = params;
    },
    deleteAnimalPhotos: async () => {
      deleteAnimalPhotosCalled = true;
    },
    getAnimalById: async () => ({
      id: 55,
      name: "Nina",
      species: "dog",
      breed: "Beagle",
      sex: "female",
      ageMonths: 36,
      size: "medium",
      status: "available",
      description: "Friendly dog.",
      coverImageUrl: "https://cdn.test/animals/55/cover.png",
      isPublished: true,
      photos: [
        { url: "https://cdn.test/animals/55/cover.png", sortOrder: 0 },
        { url: "https://cdn.test/animals/55/extra.png", sortOrder: 1 },
      ],
    }),
    updateAnimal: async () => {},
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

  const deletePublicImageUseCase: DeletePublicImageUseCase = {
    execute: async ({ url }) => {
      deletedUrls.push(url);
    },
  } as DeletePublicImageUseCase;

  const useCase = new DeleteAnimalUseCase(
    animalRepository,
    authRepository,
    foundationMembershipRepository,
    deletePublicImageUseCase,
  );

  await useCase.execute({ animalId: 55 });

  assert.deepEqual(deletedUrls, [
    "https://cdn.test/animals/55/cover.png",
    "https://cdn.test/animals/55/extra.png",
  ]);
  assert.equal(deleteAnimalPhotosCalled, true);
  assert.deepEqual(deleteAnimalParams, { animalId: 55, foundationId: "foundation-1" });
});
