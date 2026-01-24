import assert from "node:assert/strict";
import { test } from "node:test";

import type { FeaturedFoundation } from "@/domain/models/FeaturedFoundation";
import type { IFoundationRepository } from "@/domain/repositories/IFoundationRepository";
import { GetFeaturedFoundationsUseCase } from "@/domain/usecases/foundation/GetFeaturedFoundationsUseCase";

test("GetFeaturedFoundationsUseCase returns foundations from repository", async () => {
  const expected: FeaturedFoundation[] = [
    {
      id: "foundation-1",
      name: "Amigos",
      logoUrl: null,
      city: "Bogotá",
      country: "Colombia",
      animalsCount: 12,
    },
  ];

  let receivedLimit: number | null = null;
  const foundationRepository: IFoundationRepository = {
    createFoundation: async () => {
      throw new Error("not-used");
    },
    createFoundationContact: async () => {},
    createFoundationMember: async () => {},
    getFoundationById: async () => {
      throw new Error("not-used");
    },
    getShopFoundationById: async () => {
      throw new Error("not-used");
    },
    getFoundationsList: async () => [],
    getFeaturedFoundations: async (limit) => {
      receivedLimit = limit;
      return expected;
    },
    getFoundationContacts: async () => {
      throw new Error("not-used");
    },
    rollbackFoundation: async () => {},
  };

  const useCase = new GetFeaturedFoundationsUseCase(foundationRepository);
  const result = await useCase.execute({ limit: 6 });

  assert.equal(receivedLimit, 6);
  assert.deepEqual(result, expected);
});
