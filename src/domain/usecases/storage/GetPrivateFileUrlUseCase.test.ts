import assert from "node:assert/strict";
import { test } from "node:test";

import type { IAdoptionRequestRepository } from "@/domain/repositories/IAdoptionRequestRepository";
import type { IAuthRepository } from "@/domain/repositories/IAuthRepository";
import type { IFoundationMembershipRepository } from "@/domain/repositories/IFoundationMembershipRepository";
import type { IPrivateFileStorage } from "@/domain/repositories/IPrivateFileStorage";
import { GetPrivateFileUrlUseCase } from "@/domain/usecases/storage/GetPrivateFileUrlUseCase";

const basePath = "adoption-requests/foundation-1/42/id-document-123.pdf";

test("GetPrivateFileUrlUseCase returns signed URL for authorized adopter", async () => {
  const privateFileStorage: IPrivateFileStorage = {
    uploadFile: async () => "path",
    getSignedUrl: async () => "signed-url",
  };

  const authRepository: IAuthRepository = {
    signUp: async () => ({ user: { id: "user-1", email: "user@example.com", role: "external" }, session: null }),
    signIn: async () => ({ user: { id: "user-1", email: "user@example.com", role: "external" }, session: null }),
    getSession: async () => ({
      accessToken: "token",
      refreshToken: null,
      expiresAt: null,
      user: { id: "user-1", email: "user@example.com", role: "external" },
    }),
    createProfile: async () => {},
  };

  const adoptionRequestRepository: IAdoptionRequestRepository = {
    createAdoptionRequest: async () => {
      throw new Error("not implemented");
    },
    getAdoptionRequestsCounts: async () => ({
      total: 0,
      byStatus: {
        pending: 0,
        in_review: 0,
        info_requested: 0,
        preapproved: 0,
        approved: 0,
        rejected: 0,
        cancelled: 0,
        completed: 0,
      },
    }),
    getAdminRequests: async () => {
      throw new Error("not implemented");
    },
    getRequestDetail: async () => {
      throw new Error("not implemented");
    },
    updateStatus: async () => {
      throw new Error("not implemented");
    },
    getAdopterEmailByUserId: async () => {
      throw new Error("not implemented");
    },
    enqueueInfoRequestEmail: async () => {
      throw new Error("not implemented");
    },
    getRequestAccessInfo: async () => ({
      requestId: 42,
      foundationId: "foundation-1",
      adopterUserId: "user-1",
    }),
  };

  const foundationMembershipRepository: IFoundationMembershipRepository = {
    getFoundationIdForUser: async () => "foundation-1",
  };

  const useCase = new GetPrivateFileUrlUseCase(
    privateFileStorage,
    authRepository,
    adoptionRequestRepository,
    foundationMembershipRepository,
  );

  const result = await useCase.execute({ filePath: basePath });

  assert.equal(result, "signed-url");
});

test("GetPrivateFileUrlUseCase rejects unauthorized access", async () => {
  const privateFileStorage: IPrivateFileStorage = {
    uploadFile: async () => "path",
    getSignedUrl: async () => "signed-url",
  };

  const authRepository: IAuthRepository = {
    signUp: async () => ({ user: { id: "user-2", email: "user@example.com", role: "external" }, session: null }),
    signIn: async () => ({ user: { id: "user-2", email: "user@example.com", role: "external" }, session: null }),
    getSession: async () => ({
      accessToken: "token",
      refreshToken: null,
      expiresAt: null,
      user: { id: "user-2", email: "user@example.com", role: "external" },
    }),
    createProfile: async () => {},
  };

  const adoptionRequestRepository: IAdoptionRequestRepository = {
    createAdoptionRequest: async () => {
      throw new Error("not implemented");
    },
    getAdoptionRequestsCounts: async () => ({
      total: 0,
      byStatus: {
        pending: 0,
        in_review: 0,
        info_requested: 0,
        preapproved: 0,
        approved: 0,
        rejected: 0,
        cancelled: 0,
        completed: 0,
      },
    }),
    getAdminRequests: async () => {
      throw new Error("not implemented");
    },
    getRequestDetail: async () => {
      throw new Error("not implemented");
    },
    updateStatus: async () => {
      throw new Error("not implemented");
    },
    getAdopterEmailByUserId: async () => {
      throw new Error("not implemented");
    },
    enqueueInfoRequestEmail: async () => {
      throw new Error("not implemented");
    },
    getRequestAccessInfo: async () => ({
      requestId: 42,
      foundationId: "foundation-1",
      adopterUserId: "user-1",
    }),
  };

  const foundationMembershipRepository: IFoundationMembershipRepository = {
    getFoundationIdForUser: async () => "foundation-1",
  };

  const useCase = new GetPrivateFileUrlUseCase(
    privateFileStorage,
    authRepository,
    adoptionRequestRepository,
    foundationMembershipRepository,
  );

  await assert.rejects(() => useCase.execute({ filePath: basePath }), (error: Error) => {
    assert.equal(error.message, "storage.private.upload.error.accessDenied");
    return true;
  });
});

test("GetPrivateFileUrlUseCase rejects invalid paths", async () => {
  const privateFileStorage: IPrivateFileStorage = {
    uploadFile: async () => "path",
    getSignedUrl: async () => "signed-url",
  };

  const authRepository: IAuthRepository = {
    signUp: async () => ({ user: { id: "user-1", email: "user@example.com", role: "external" }, session: null }),
    signIn: async () => ({ user: { id: "user-1", email: "user@example.com", role: "external" }, session: null }),
    getSession: async () => ({
      accessToken: "token",
      refreshToken: null,
      expiresAt: null,
      user: { id: "user-1", email: "user@example.com", role: "external" },
    }),
    createProfile: async () => {},
  };

  const adoptionRequestRepository: IAdoptionRequestRepository = {
    createAdoptionRequest: async () => {
      throw new Error("not implemented");
    },
    getAdoptionRequestsCounts: async () => ({
      total: 0,
      byStatus: {
        pending: 0,
        in_review: 0,
        info_requested: 0,
        preapproved: 0,
        approved: 0,
        rejected: 0,
        cancelled: 0,
        completed: 0,
      },
    }),
    getAdminRequests: async () => {
      throw new Error("not implemented");
    },
    getRequestDetail: async () => {
      throw new Error("not implemented");
    },
    updateStatus: async () => {
      throw new Error("not implemented");
    },
    getAdopterEmailByUserId: async () => {
      throw new Error("not implemented");
    },
    enqueueInfoRequestEmail: async () => {
      throw new Error("not implemented");
    },
    getRequestAccessInfo: async () => ({
      requestId: 42,
      foundationId: "foundation-1",
      adopterUserId: "user-1",
    }),
  };

  const foundationMembershipRepository: IFoundationMembershipRepository = {
    getFoundationIdForUser: async () => "foundation-1",
  };

  const useCase = new GetPrivateFileUrlUseCase(
    privateFileStorage,
    authRepository,
    adoptionRequestRepository,
    foundationMembershipRepository,
  );

  await assert.rejects(() => useCase.execute({ filePath: "invalid-path" }), (error: Error) => {
    assert.equal(error.message, "storage.private.url.error.generating");
    return true;
  });
});
