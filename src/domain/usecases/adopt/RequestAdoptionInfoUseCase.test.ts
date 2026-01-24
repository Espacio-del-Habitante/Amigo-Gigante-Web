import assert from "node:assert/strict";
import { test } from "node:test";

import type { AdoptionRequestDetail } from "@/domain/models/AdoptionRequest";
import type { IAdoptionRequestRepository } from "@/domain/repositories/IAdoptionRequestRepository";
import type { IAuthRepository } from "@/domain/repositories/IAuthRepository";
import type { IFoundationMembershipRepository } from "@/domain/repositories/IFoundationMembershipRepository";
import { RequestAdoptionInfoUseCase } from "@/domain/usecases/adopt/RequestAdoptionInfoUseCase";

const buildDetail = (overrides?: Partial<AdoptionRequestDetail>): AdoptionRequestDetail => ({
  id: 12,
  status: "pending",
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
    id: 7,
    name: "Luna",
    species: "dog",
    breed: null,
    sex: "female",
    ageMonths: 18,
    size: "medium",
    coverImageUrl: null,
  },
  documents: [],
  ...overrides,
});

test("RequestAdoptionInfoUseCase enqueues email and updates status", async () => {
  let enqueuePayload: Parameters<IAdoptionRequestRepository["enqueueInfoRequestEmail"]>[0] | null = null;
  let updatePayload: Parameters<IAdoptionRequestRepository["updateStatus"]>[0] | null = null;

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
      requestId: 12,
      foundationId: "foundation-1",
      adopterUserId: "user-99",
    }),
    getAdopterEmailByUserId: async () => {
      throw new Error("not implemented");
    },
    enqueueInfoRequestEmail: async (params) => {
      enqueuePayload = params;
    },
    saveResponseMessage: async () => {},
    notifyFoundationMembers: async () => {},
    updateStatus: async (params) => {
      updatePayload = params;
    },
  };

  const authRepository: IAuthRepository = {
    signUp: async () => ({ user: { id: "foundation-user", email: "f@example.com", role: "foundation_user" }, session: null }),
    signIn: async () => ({ user: { id: "foundation-user", email: "f@example.com", role: "foundation_user" }, session: null }),
    getSession: async () => ({
      accessToken: "token",
      refreshToken: null,
      expiresAt: null,
      user: { id: "foundation-user", email: "f@example.com", role: "foundation_user" },
    }),
    createProfile: async () => {},
  };

  const foundationMembershipRepository: IFoundationMembershipRepository = {
    getFoundationIdForUser: async () => "foundation-1",
  };

  const useCase = new RequestAdoptionInfoUseCase(
    adoptionRequestRepository,
    authRepository,
    foundationMembershipRepository,
  );

  await useCase.execute({
    requestId: 12,
    subject: "Subject",
    message: "Message",
  });

  assert.deepEqual(enqueuePayload, {
    requestId: 12,
    adopterUserId: "user-99",
    toEmail: "adopter@example.com",
    subject: "Subject",
    message: "Message",
    animalName: "Luna",
    animalId: 7,
    foundationId: "foundation-1",
  });
  assert.deepEqual(updatePayload, {
    foundationId: "foundation-1",
    requestId: 12,
    status: "info_requested",
  });
});

test("RequestAdoptionInfoUseCase rejects when adopter email is missing", async () => {
  const adoptionRequestRepository: IAdoptionRequestRepository = {
    createAdoptionRequest: async () => {
      throw new Error("not implemented");
    },
    getAdminRequests: async () => {
      throw new Error("not implemented");
    },
    getUserRequests: async () => ({ requests: [] }),
    getRequestDetail: async () => buildDetail({ adopterProfile: { ...buildDetail().adopterProfile, email: null } }),
    getRequestAccessInfo: async () => ({
      requestId: 12,
      foundationId: "foundation-1",
      adopterUserId: "user-99",
    }),
    getAdopterEmailByUserId: async () => null,
    enqueueInfoRequestEmail: async () => {
      throw new Error("should not enqueue");
    },
    saveResponseMessage: async () => {
      throw new Error("should not save response");
    },
    notifyFoundationMembers: async () => {
      throw new Error("should not notify");
    },
    updateStatus: async () => {
      throw new Error("should not update");
    },
  };

  const authRepository: IAuthRepository = {
    signUp: async () => ({ user: { id: "foundation-user", email: "f@example.com", role: "foundation_user" }, session: null }),
    signIn: async () => ({ user: { id: "foundation-user", email: "f@example.com", role: "foundation_user" }, session: null }),
    getSession: async () => ({
      accessToken: "token",
      refreshToken: null,
      expiresAt: null,
      user: { id: "foundation-user", email: "f@example.com", role: "foundation_user" },
    }),
    createProfile: async () => {},
  };

  const foundationMembershipRepository: IFoundationMembershipRepository = {
    getFoundationIdForUser: async () => "foundation-1",
  };

  const useCase = new RequestAdoptionInfoUseCase(
    adoptionRequestRepository,
    authRepository,
    foundationMembershipRepository,
  );

  await assert.rejects(() => useCase.execute({ requestId: 12, subject: "Subject", message: "Message" }), (error: Error) => {
    assert.equal(error.message, "errors.adopterEmailNotFound");
    return true;
  });
});
