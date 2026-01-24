import assert from "node:assert/strict";
import { test } from "node:test";

import type { IUserProfileRepository } from "@/domain/repositories/IUserProfileRepository";
import { UpdateUserProfileUseCase } from "@/domain/usecases/account/UpdateUserProfileUseCase";

const baseProfile = {
  id: "user-1",
  displayName: "Test User",
  phone: "+57 300 000 0000",
  email: "test@example.com",
};

test("UpdateUserProfileUseCase updates profile data", async () => {
  let updatedProfile: typeof baseProfile | null = null;

  const repository: IUserProfileRepository = {
    getUserProfile: async () => baseProfile,
    updateUserProfile: async (profile) => {
      updatedProfile = profile;
      return profile;
    },
    changePassword: async () => {},
    deleteUserAccount: async () => {},
  };

  const useCase = new UpdateUserProfileUseCase(repository);

  const result = await useCase.execute({
    ...baseProfile,
    displayName: "Updated",
  });

  assert.equal(result.displayName, "Updated");
  assert.equal(updatedProfile?.displayName, "Updated");
});
