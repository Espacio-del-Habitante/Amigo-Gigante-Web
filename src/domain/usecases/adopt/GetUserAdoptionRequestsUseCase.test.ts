import assert from "node:assert/strict";
import { test } from "node:test";

import type { IAdoptionRequestRepository } from "@/domain/repositories/IAdoptionRequestRepository";
import type { IAuthRepository } from "@/domain/repositories/IAuthRepository";
import { GetUserAdoptionRequestsUseCase } from "@/domain/usecases/adopt/GetUserAdoptionRequestsUseCase";

const baseRequestsResult = {
  requests: [
    {
      id: 1,
      animal: {
        id: 10,
        name: "Luna",
        species: "cat" as const,
        coverImageUrl: null,
      },
      foundation: {
        id: "foundation-1",
        name: "Refugio Central",
      },
      status: "pending" as const,
      createdAt: "2024-01-10T12:00:00Z",
    },
  ],
};

const baseRepository: IAdoptionRequestRepository = {
  createAdoptionRequest: async () => {
    throw new Error("not implemented");
  },
  getAdminRequests: async () => {
    throw new Error("not implemented");
  },
  getUserRequests: async () => baseRequestsResult,
  getRequestDetail: async () => {
    throw new Error("not implemented");
  },
  getRequestAccessInfo: async () => {
    throw new Error("not implemented");
  },
  getRequestMessages: async () => [],
  getAdopterEmailByUserId: async () => null,
  enqueueInfoRequestEmail: async () => {},
  saveResponseMessage: async () => {},
  notifyFoundationMembers: async () => {},
  updateStatus: async () => {},
};

const createAuthRepository = (session: Awaited<ReturnType<IAuthRepository["getSession"]>>) => {
  const repository: IAuthRepository = {
    signUp: async () => {
      throw new Error("not implemented");
    },
    signIn: async () => {
      throw new Error("not implemented");
    },
    getSession: async () => session,
    createProfile: async () => {},
    signOut: async () => {},
  };

  return repository;
};

test("GetUserAdoptionRequestsUseCase returns adoption requests for external users", async () => {
  const authRepository = createAuthRepository({
    accessToken: "token",
    user: {
      id: "user-1",
      email: "user@example.com",
      role: "external",
    },
  });

  const useCase = new GetUserAdoptionRequestsUseCase(baseRepository, authRepository);
  const result = await useCase.execute();

  assert.deepEqual(result, baseRequestsResult);
});

test("GetUserAdoptionRequestsUseCase throws when session is missing", async () => {
  const authRepository = createAuthRepository(null);
  const useCase = new GetUserAdoptionRequestsUseCase(baseRepository, authRepository);

  await assert.rejects(() => useCase.execute(), { message: "errors.unauthorized" });
});

test("GetUserAdoptionRequestsUseCase throws when user is not external", async () => {
  const authRepository = createAuthRepository({
    accessToken: "token",
    user: {
      id: "user-2",
      email: "admin@example.com",
      role: "foundation_user",
    },
  });

  const useCase = new GetUserAdoptionRequestsUseCase(baseRepository, authRepository);

  await assert.rejects(() => useCase.execute(), { message: "errors.forbidden" });
});
