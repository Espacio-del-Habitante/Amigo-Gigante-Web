import { AuthApiError } from "@supabase/supabase-js";
import { injectable } from "inversify";

import type { UserProfile } from "@/domain/models/UserProfile";
import type { ChangePasswordParams, IUserProfileRepository } from "@/domain/repositories/IUserProfileRepository";
import { supabaseClient } from "@/infrastructure/config/supabase";

const AVATAR_ALLOWED_MIME_TYPES = new Set(["image/png", "image/jpeg", "image/jpg", "image/gif"]);
const AVATAR_ALLOWED_EXTENSIONS = [".png", ".jpg", ".jpeg", ".gif"];
const AVATAR_MAX_SIZE_BYTES = 5 * 1024 * 1024;

@injectable()
export class UserProfileRepository implements IUserProfileRepository {
  async getUserProfile(): Promise<UserProfile> {
    const user = await this.getAuthenticatedUser();

    const { data, error } = await supabaseClient
      .from("profiles")
      .select("display_name, phone, avatar_url")
      .eq("id", user.id)
      .single();

    if (error) {
      throw new Error("account.errors.profileLoadFailed");
    }

    return {
      id: user.id,
      email: user.email ?? "",
      displayName: data?.display_name ?? "",
      phone: data?.phone ?? null,
      avatarUrl: data?.avatar_url ?? null,
    };
  }

  async updateUserProfile(profile: UserProfile): Promise<UserProfile> {
    const { data, error } = await supabaseClient
      .from("profiles")
      .update({
        display_name: profile.displayName || null,
        phone: profile.phone,
        avatar_url: profile.avatarUrl,
      })
      .eq("id", profile.id)
      .select("display_name, phone, avatar_url")
      .single();

    if (error) {
      throw new Error("account.errors.profileUpdateFailed");
    }

    return {
      ...profile,
      displayName: data?.display_name ?? profile.displayName,
      phone: data?.phone ?? null,
      avatarUrl: data?.avatar_url ?? null,
    };
  }

  async uploadAvatar(file: File, userId: string): Promise<string> {
    this.validateAvatarFile(file);

    const bucketName = "avatars";
    const path = `${userId}/${Date.now()}-${this.sanitizeFileName(file.name)}`;

    const { data, error } = await supabaseClient.storage.from(bucketName).upload(path, file, {
      upsert: false,
    });

    if (error) {
      throw new Error(this.translateStorageError(error));
    }

    const { data: urlData } = supabaseClient.storage.from(bucketName).getPublicUrl(data?.path ?? "");
    const publicUrl = urlData?.publicUrl ?? "";

    if (!publicUrl) {
      throw new Error("account.photo.errors.uploadFailed");
    }

    return publicUrl;
  }

  async deleteAvatar(url: string): Promise<void> {
    if (!this.isStorageUrl(url)) {
      return;
    }

    const bucketName = "avatars";
    const path = this.extractPathFromUrl(url);

    if (!path) {
      return;
    }

    const { error } = await supabaseClient.storage.from(bucketName).remove([path]);

    if (error) {
      throw new Error("account.photo.errors.removeFailed");
    }
  }

  async changePassword({ currentPassword, newPassword }: ChangePasswordParams): Promise<void> {
    const user = await this.getAuthenticatedUser();

    const { error: signInError } = await supabaseClient.auth.signInWithPassword({
      email: user.email ?? "",
      password: currentPassword,
    });

    if (signInError) {
      throw new Error(this.translatePasswordError(signInError));
    }

    const { error: updateError } = await supabaseClient.auth.updateUser({ password: newPassword });

    if (updateError) {
      throw new Error("account.errors.passwordUpdateFailed");
    }
  }

  async deleteUserAccount(): Promise<void> {
    const user = await this.getAuthenticatedUser();
    const adminApi = supabaseClient.auth.admin;

    if (!adminApi) {
      throw new Error("account.errors.deleteFailed");
    }

    const { error } = await adminApi.deleteUser(user.id);

    if (error) {
      throw new Error("account.errors.deleteFailed");
    }

    await supabaseClient.auth.signOut();
  }

  private async getAuthenticatedUser() {
    const { data, error } = await supabaseClient.auth.getUser();

    if (error || !data.user) {
      throw new Error("account.errors.unauthorized");
    }

    return data.user;
  }

  private validateAvatarFile(file: File): void {
    const hasValidMimeType = AVATAR_ALLOWED_MIME_TYPES.has(file.type);
    const hasValidExtension = AVATAR_ALLOWED_EXTENSIONS.some((extension) =>
      file.name.toLowerCase().endsWith(extension),
    );

    if (!hasValidMimeType && !hasValidExtension) {
      throw new Error("account.photo.errors.invalidFormat");
    }

    if (file.size > AVATAR_MAX_SIZE_BYTES) {
      throw new Error("account.photo.errors.tooLarge");
    }
  }

  private sanitizeFileName(fileName: string): string {
    return fileName
      .replace(/[^a-z0-9.\-_]/gi, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$|^_+|_+$/g, "")
      .toLowerCase();
  }

  private isStorageUrl(url: string): boolean {
    return url.includes("/storage/v1/object/public/avatars/");
  }

  private extractPathFromUrl(url: string): string {
    const prefix = "/storage/v1/object/public/avatars/";
    const index = url.indexOf(prefix);

    if (index === -1) return "";

    return url.substring(index + prefix.length);
  }

  private translateStorageError(error: { message?: string; code?: string }): string {
    const message = error.message?.toLowerCase?.() ?? "";
    const code = error.code?.toLowerCase?.() ?? "";

    if (code === "request_entity_too_large" || message.includes("too large")) {
      return "account.photo.errors.tooLarge";
    }

    if (
      message.includes("invalid") ||
      message.includes("mime") ||
      message.includes("content-type") ||
      message.includes("format")
    ) {
      return "account.photo.errors.invalidFormat";
    }

    return "account.photo.errors.uploadFailed";
  }

  private translatePasswordError(error: AuthApiError | Error): string {
    const message = error.message?.toLowerCase?.() ?? "";

    if (message.includes("invalid") || message.includes("credentials")) {
      return "account.errors.currentPasswordInvalid";
    }

    return "account.errors.passwordUpdateFailed";
  }
}
