import assert from "node:assert/strict";
import { test } from "node:test";

import type { IUserProfileRepository } from "@/domain/repositories/IUserProfileRepository";
import { GetUserProfileUseCase } from "@/domain/usecases/account/GetUserProfileUseCase";

const baseProfile = {
  id: "user-1",
  displayName: "Test User",
  phone: "+57 300 000 0000",
  email: "test@example.com",
  avatarUrl: null,
};

test("GetUserProfileUseCase returns repository profile", async () => {
  const repository: IUserProfileRepository = {
    getUserProfile: async () => baseProfile,
    updateUserProfile: async () => baseProfile,
    uploadAvatar: async () => "",
    deleteAvatar: async () => {},
    changePassword: async () => {},
    deleteUserAccount: async () => {},
  };

  const useCase = new GetUserProfileUseCase(repository);
  const result = await useCase.execute();

  assert.deepEqual(result, baseProfile);
});
