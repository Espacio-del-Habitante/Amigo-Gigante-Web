import type { UserProfile } from "@/domain/models/UserProfile";

export interface ChangePasswordParams {
  currentPassword: string;
  newPassword: string;
}

export interface IUserProfileRepository {
  getUserProfile(): Promise<UserProfile>;
  updateUserProfile(profile: UserProfile): Promise<UserProfile>;
  uploadAvatar(file: File, userId: string): Promise<string>;
  deleteAvatar(url: string): Promise<void>;
  changePassword(params: ChangePasswordParams): Promise<void>;
  deleteUserAccount(): Promise<void>;
}
