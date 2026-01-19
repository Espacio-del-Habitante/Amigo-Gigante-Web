import assert from "node:assert/strict";
import { test } from "node:test";

import type { CreateProfileParams, IAuthRepository } from "@/domain/repositories/IAuthRepository";
import type { INotificationRepository } from "@/domain/repositories/INotificationRepository";
import { MarkNotificationAsReadUseCase } from "@/domain/usecases/notifications/MarkNotificationAsReadUseCase";

test("MarkNotificationAsReadUseCase marks notification for authenticated user", async () => {
  let calledWith: { userId: string; notificationId: string } | null = null;

  const authRepository: IAuthRepository = {
    signUp: async () => ({ session: null, user: { id: "user-1", email: "test@example.com", role: "foundation_user" } }),
    signIn: async () => ({ session: null, user: { id: "user-1", email: "test@example.com", role: "foundation_user" } }),
    getSession: async () => ({
      accessToken: "token",
      user: { id: "user-1", email: "test@example.com", role: "foundation_user" },
    }),
    createProfile: async (_params: CreateProfileParams) => {},
  };

  const notificationRepository: INotificationRepository = {
    getNotifications: async () => [],
    markAsRead: async (userId, notificationId) => {
      calledWith = { userId, notificationId };
    },
  };

  const useCase = new MarkNotificationAsReadUseCase(notificationRepository, authRepository);
  await useCase.execute("notification-1");

  assert.deepEqual(calledWith, { userId: "user-1", notificationId: "notification-1" });
});
