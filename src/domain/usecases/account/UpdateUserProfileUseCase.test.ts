import assert from "node:assert/strict";
import { test } from "node:test";

import type { IUserProfileRepository } from "@/domain/repositories/IUserProfileRepository";
import { UpdateUserProfileUseCase } from "@/domain/usecases/account/UpdateUserProfileUseCase";

const baseProfile = {
  id: "user-1",
  displayName: "Test User",
  phone: "+57 300 000 0000",
  email: "test@example.com",
  avatarUrl: "https://example.com/old.png",
};

test("UpdateUserProfileUseCase uploads new avatar and updates profile", async () => {
  let deletedUrl: string | null = null;
  let uploadedForUser: { userId: string; fileName: string } | null = null;
  let updatedProfile: typeof baseProfile | null = null;

  const repository: IUserProfileRepository = {
    getUserProfile: async () => baseProfile,
    updateUserProfile: async (profile) => {
      updatedProfile = profile;
      return profile;
    },
    uploadAvatar: async (file, userId) => {
      uploadedForUser = { userId, fileName: file.name };
      return "https://example.com/new.png";
    },
    deleteAvatar: async (url) => {
      deletedUrl = url;
    },
    changePassword: async () => {},
    deleteUserAccount: async () => {},
  };

  const useCase = new UpdateUserProfileUseCase(repository);
  const file = new File(["avatar"], "avatar.png", { type: "image/png" });

  const result = await useCase.execute({
    ...baseProfile,
    displayName: "Updated",
    avatarFile: file,
  });

  assert.equal(deletedUrl, baseProfile.avatarUrl);
  assert.deepEqual(uploadedForUser, { userId: baseProfile.id, fileName: "avatar.png" });
  assert.equal(result.avatarUrl, "https://example.com/new.png");
  assert.equal(updatedProfile?.avatarUrl, "https://example.com/new.png");
});
