import assert from "node:assert/strict";
import { test } from "node:test";

import type { IUserProfileRepository } from "@/domain/repositories/IUserProfileRepository";
import { ChangePasswordUseCase } from "@/domain/usecases/account/ChangePasswordUseCase";

test("ChangePasswordUseCase delegates to repository", async () => {
  let receivedParams: { currentPassword: string; newPassword: string } | null = null;

  const repository: IUserProfileRepository = {
    getUserProfile: async () => ({
      id: "user-1",
      displayName: "Test",
      phone: null,
      email: "test@example.com",
    }),
    updateUserProfile: async (profile) => profile,
    changePassword: async (params) => {
      receivedParams = params;
    },
    deleteUserAccount: async () => {},
  };

  const useCase = new ChangePasswordUseCase(repository);
  await useCase.execute({ currentPassword: "old", newPassword: "newPassword1" });

  assert.deepEqual(receivedParams, { currentPassword: "old", newPassword: "newPassword1" });
});
