import assert from "node:assert/strict";
import { test } from "node:test";

import type { IUserProfileRepository } from "@/domain/repositories/IUserProfileRepository";
import { DeleteUserAccountUseCase } from "@/domain/usecases/account/DeleteUserAccountUseCase";

test("DeleteUserAccountUseCase delegates to repository", async () => {
  let deleteCalled = false;

  const repository: IUserProfileRepository = {
    getUserProfile: async () => ({
      id: "user-1",
      displayName: "Test",
      phone: null,
      email: "test@example.com",
    }),
    updateUserProfile: async (profile) => profile,
    changePassword: async () => {},
    deleteUserAccount: async () => {
      deleteCalled = true;
    },
  };

  const useCase = new DeleteUserAccountUseCase(repository);
  await useCase.execute();

  assert.equal(deleteCalled, true);
});
