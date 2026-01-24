import assert from "node:assert/strict";
import { test } from "node:test";

import type { AdoptionRequestDetail } from "@/domain/models/AdoptionRequest";
import type { IAdoptionRequestRepository } from "@/domain/repositories/IAdoptionRequestRepository";
import type { IAuthRepository } from "@/domain/repositories/IAuthRepository";
import { GetRequestInfoForResponseUseCase } from "@/domain/usecases/adopt/GetRequestInfoForResponseUseCase";

const buildDetail = (overrides?: Partial<AdoptionRequestDetail>): AdoptionRequestDetail => ({
  id: 1,
  status: "info_requested",
  priority: "low",
  rejectionReason: null,
  createdAt: new Date().toISOString(),
  adopterProfile: {
    displayName: "Alex",
    phone: null,
    email: "adopter@example.com",
    city: null,
    neighborhood: null,
    housingType: null,
    isRent: null,
    allowsPets: null,
    householdPeopleCount: null,
    hasChildren: null,
    childrenAges: null,
    hasOtherPets: null,
    otherPetsDescription: null,
    hoursAlonePerDay: null,
    travelPlan: null,
    experienceText: null,
    motivationText: null,
    acceptsVetCosts: null,
    acceptsLifetimeCommitment: null,
  },
  animal: {
    id: 4,
    name: "Bruno",
    species: "dog",
    breed: null,
    sex: "male",
    ageMonths: 24,
    size: "medium",
    coverImageUrl: null,
  },
  documents: [],
  ...overrides,
});

const createAuthRepository = (session: Awaited<ReturnType<IAuthRepository["getSession"]>>): IAuthRepository => ({
  signUp: async () => {
    throw new Error("not implemented");
  },
  signIn: async () => {
    throw new Error("not implemented");
  },
  getSession: async () => session,
  createProfile: async () => {},
  signOut: async () => {},
});

test("GetRequestInfoForResponseUseCase returns request info and foundation message", async () => {
  const adoptionRequestRepository: IAdoptionRequestRepository = {
    createAdoptionRequest: async () => {
      throw new Error("not implemented");
    },
    getAdminRequests: async () => {
      throw new Error("not implemented");
    },
    getUserRequests: async () => ({
      requests: [
        {
          id: 1,
          animal: {
            id: 4,
            name: "Bruno",
            species: "dog",
            coverImageUrl: null,
          },
          foundation: {
            id: "foundation-1",
            name: "Huellas",
          },
          status: "info_requested",
          createdAt: new Date().toISOString(),
        },
      ],
    }),
    getRequestAccessInfo: async () => ({
      requestId: 1,
      foundationId: "foundation-1",
      adopterUserId: "user-1",
    }),
    getRequestMessages: async () => [
      {
        id: 10,
        senderUserId: "foundation-user",
        senderRole: "foundation",
        messageText: "Necesitamos un video del patio.",
        createdAt: "2024-02-01T10:00:00Z",
        files: [],
      },
    ],
    getAdopterEmailByUserId: async () => null,
    enqueueInfoRequestEmail: async () => {},
    saveResponseMessage: async () => {},
    notifyFoundationMembers: async () => {},
    updateStatus: async () => {},
  };

  const authRepository = createAuthRepository({
    accessToken: "token",
    user: {
      id: "user-1",
      email: "user@example.com",
      role: "external",
    },
  });

  const useCase = new GetRequestInfoForResponseUseCase(adoptionRequestRepository, authRepository);

  const result = await useCase.execute({ requestId: 1 });

  assert.equal(result.request.foundation.name, "Huellas");
  assert.equal(result.foundationMessage?.message, "Necesitamos un video del patio.");
  assert.equal(result.foundationMessage?.foundationName, "Huellas");
});

test("GetRequestInfoForResponseUseCase rejects when status is invalid", async () => {
  const adoptionRequestRepository: IAdoptionRequestRepository = {
    createAdoptionRequest: async () => {
      throw new Error("not implemented");
    },
    getAdminRequests: async () => {
      throw new Error("not implemented");
    },
    getUserRequests: async () => ({
      requests: [
        {
          id: 1,
          animal: {
            id: 4,
            name: "Bruno",
            species: "dog",
            coverImageUrl: null,
          },
          foundation: {
            id: "foundation-1",
            name: "Huellas",
          },
          status: "pending",
          createdAt: new Date().toISOString(),
        },
      ],
    }),
    getRequestAccessInfo: async () => ({
      requestId: 1,
      foundationId: "foundation-1",
      adopterUserId: "user-1",
    }),
    getRequestMessages: async () => [],
    getAdopterEmailByUserId: async () => null,
    enqueueInfoRequestEmail: async () => {},
    saveResponseMessage: async () => {},
    notifyFoundationMembers: async () => {},
    updateStatus: async () => {},
  };

  const authRepository = createAuthRepository({
    accessToken: "token",
    user: {
      id: "user-1",
      email: "user@example.com",
      role: "external",
    },
  });

  const useCase = new GetRequestInfoForResponseUseCase(adoptionRequestRepository, authRepository);

  await assert.rejects(() => useCase.execute({ requestId: 1 }), { message: "errors.invalidStatus" });
});
