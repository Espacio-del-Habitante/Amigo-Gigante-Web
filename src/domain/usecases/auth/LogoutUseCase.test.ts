import assert from "node:assert/strict";
import { test } from "node:test";

import type { IAuthRepository } from "@/domain/repositories/IAuthRepository";
import { LogoutUseCase } from "@/domain/usecases/auth/LogoutUseCase";

test("LogoutUseCase calls auth repository signOut", async () => {
  let signOutCalled = false;

  const authRepository: IAuthRepository = {
    signUp: async () => ({
      user: { id: "user-1", email: "test@example.com", role: "foundation_user" },
      session: null,
    }),
    signIn: async () => ({
      user: { id: "user-1", email: "test@example.com", role: "foundation_user" },
      session: null,
    }),
    getSession: async () => null,
    createProfile: async () => {},
    signOut: async () => {
      signOutCalled = true;
    },
  };

  const useCase = new LogoutUseCase(authRepository);

  await useCase.execute();

  assert.equal(signOutCalled, true);
});
