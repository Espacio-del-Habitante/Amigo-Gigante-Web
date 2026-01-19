import assert from "node:assert/strict";
import { test } from "node:test";

import type { CreateProfileParams, IAuthRepository } from "@/domain/repositories/IAuthRepository";
import { RegisterExternalUserUseCase } from "@/domain/usecases/auth/RegisterExternalUserUseCase";

test("RegisterExternalUserUseCase registers external users with profile data", async () => {
  let signUpCalledWith: { email: string; password: string } | null = null;
  let createProfileCalledWith: CreateProfileParams | null = null;

  const authRepository: IAuthRepository = {
    signUp: async (params) => {
      signUpCalledWith = params;
      return {
        user: { id: "user-1", email: params.email, role: "foundation_user" },
        session: {
          accessToken: "token",
          refreshToken: null,
          expiresAt: null,
          user: { id: "user-1", email: params.email, role: "foundation_user" },
        },
      };
    },
    signIn: async () => ({
      user: { id: "user-1", email: "test@example.com", role: "foundation_user" },
      session: null,
    }),
    getSession: async () => null,
    createProfile: async (params) => {
      createProfileCalledWith = params;
    },
    signOut: async () => {},
  };

  const useCase = new RegisterExternalUserUseCase(authRepository);
  const result = await useCase.execute({
    email: "adopter@example.com",
    password: "password123",
    displayName: "Adopter Name",
    phone: "+57 300 000 0000",
  });

  assert.deepEqual(signUpCalledWith, { email: "adopter@example.com", password: "password123" });
  assert.deepEqual(createProfileCalledWith, {
    userId: "user-1",
    role: "external",
    displayName: "Adopter Name",
    phone: "+57 300 000 0000",
  });
  assert.equal(result.user.role, "external");
  assert.equal(result.session?.user?.role, "external");
});

test("RegisterExternalUserUseCase maps repository errors to external errors", async () => {
  const authRepository: IAuthRepository = {
    signUp: async () => {
      throw new Error("form.errors.emailExists");
    },
    signIn: async () => ({
      user: { id: "user-1", email: "test@example.com", role: "foundation_user" },
      session: null,
    }),
    getSession: async () => null,
    createProfile: async () => {},
    signOut: async () => {},
  };

  const useCase = new RegisterExternalUserUseCase(authRepository);

  await assert.rejects(
    () =>
      useCase.execute({
        email: "adopter@example.com",
        password: "password123",
      }),
    (error: Error) => {
      assert.equal(error.message, "external.errors.emailExists");
      return true;
    },
  );
});
