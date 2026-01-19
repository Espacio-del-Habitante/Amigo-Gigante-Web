import assert from "node:assert/strict";
import { describe, it } from "node:test";

import type { IAuthRepository } from "@/domain/repositories/IAuthRepository";
import { LogoutUseCase } from "@/domain/usecases/auth/LogoutUseCase";

const buildAuthRepository = (overrides: Partial<IAuthRepository> = {}): IAuthRepository => {
  return {
    signUp: async () => {
      throw new Error("Not implemented");
    },
    signIn: async () => {
      throw new Error("Not implemented");
    },
    getSession: async () => null,
    createProfile: async () => undefined,
    signOut: async () => undefined,
    ...overrides,
  };
};

describe("LogoutUseCase", () => {
  it("calls signOut on the auth repository", async () => {
    let called = false;
    const authRepository = buildAuthRepository({
      signOut: async () => {
        called = true;
      },
    });

    const useCase = new LogoutUseCase(authRepository);

    await useCase.execute();

    assert.equal(called, true);
  });

  it("propagates errors from the auth repository", async () => {
    const authRepository = buildAuthRepository({
      signOut: async () => {
        throw new Error("Logout failed");
      },
    });

    const useCase = new LogoutUseCase(authRepository);

    await assert.rejects(() => useCase.execute(), /Logout failed/);
  });
});
