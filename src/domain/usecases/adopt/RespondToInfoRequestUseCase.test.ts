import assert from "node:assert/strict";
import { test } from "node:test";

import type { AdoptionRequestDetail } from "@/domain/models/AdoptionRequest";
import type { IAdoptionRequestRepository } from "@/domain/repositories/IAdoptionRequestRepository";
import type { IAuthRepository } from "@/domain/repositories/IAuthRepository";
import type { IPrivateFileStorage } from "@/domain/repositories/IPrivateFileStorage";
import { RespondToInfoRequestUseCase } from "@/domain/usecases/adopt/RespondToInfoRequestUseCase";

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

test("RespondToInfoRequestUseCase saves response, updates status, and notifies", async () => {
  let savedPayload: Parameters<IAdoptionRequestRepository["saveResponseMessage"]>[0] | null = null;
  let statusPayload: Parameters<IAdoptionRequestRepository["updateStatus"]>[0] | null = null;
  let notificationPayload: Parameters<IAdoptionRequestRepository["notifyFoundationMembers"]>[0] | null = null;

  const adoptionRequestRepository: IAdoptionRequestRepository = {
    createAdoptionRequest: async () => {
      throw new Error("not implemented");
    },
    getAdminRequests: async () => {
      throw new Error("not implemented");
    },
    getUserRequests: async () => ({ requests: [] }),
    getRequestDetail: async () => buildDetail(),
    getRequestAccessInfo: async () => ({
      requestId: 1,
      foundationId: "foundation-1",
      adopterUserId: "user-1",
    }),
    getRequestMessages: async () => [],
    getAdopterEmailByUserId: async () => null,
    enqueueInfoRequestEmail: async () => {},
    saveResponseMessage: async (params) => {
      savedPayload = params;
    },
    notifyFoundationMembers: async (params) => {
      notificationPayload = params;
    },
    updateStatus: async (params) => {
      statusPayload = params;
    },
  };

  const authRepository = createAuthRepository({
    accessToken: "token",
    user: {
      id: "user-1",
      email: "user@example.com",
      role: "external",
    },
  });

  const storage: IPrivateFileStorage = {
    uploadFile: async () => "adoption-requests/foundation-1/1/response-file.pdf",
    getSignedUrl: async () => "signed-url",
  };

  const useCase = new RespondToInfoRequestUseCase(adoptionRequestRepository, authRepository, storage);

  await useCase.execute({
    requestId: 1,
    message: "Respuesta",
    files: [new File(["content"], "file.pdf", { type: "application/pdf" })],
  });

  assert.deepEqual(savedPayload, {
    requestId: 1,
    senderUserId: "user-1",
    senderRole: "adopter",
    messageText: "Respuesta",
    fileUrls: ["adoption-requests/foundation-1/1/response-file.pdf"],
  });
  assert.deepEqual(statusPayload, {
    foundationId: "foundation-1",
    requestId: 1,
    status: "in_review",
  });
  assert.ok(notificationPayload);
  assert.equal(notificationPayload?.type, "adoption_info_response");
});

test("RespondToInfoRequestUseCase rejects empty messages", async () => {
  const adoptionRequestRepository: IAdoptionRequestRepository = {
    createAdoptionRequest: async () => {
      throw new Error("not implemented");
    },
    getAdminRequests: async () => {
      throw new Error("not implemented");
    },
    getUserRequests: async () => ({ requests: [] }),
    getRequestDetail: async () => buildDetail(),
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

  const storage: IPrivateFileStorage = {
    uploadFile: async () => "path",
    getSignedUrl: async () => "signed-url",
  };

  const useCase = new RespondToInfoRequestUseCase(adoptionRequestRepository, authRepository, storage);

  await assert.rejects(() => useCase.execute({ requestId: 1, message: "  " }), { message: "errors.messageRequired" });
});
