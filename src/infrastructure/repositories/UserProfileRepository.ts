import { AuthApiError } from "@supabase/supabase-js";
import { injectable } from "inversify";

import type { UserProfile } from "@/domain/models/UserProfile";
import type { ChangePasswordParams, IUserProfileRepository } from "@/domain/repositories/IUserProfileRepository";
import { supabaseClient } from "@/infrastructure/config/supabase";

@injectable()
export class UserProfileRepository implements IUserProfileRepository {
  async getUserProfile(): Promise<UserProfile> {
    const user = await this.getAuthenticatedUser();

    const { data, error } = await supabaseClient
      .from("profiles")
      .select("display_name, phone")
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
    };
  }

  async updateUserProfile(profile: UserProfile): Promise<UserProfile> {
    const { data, error } = await supabaseClient
      .from("profiles")
      .update({
        display_name: profile.displayName || null,
        phone: profile.phone,
      })
      .eq("id", profile.id)
      .select("display_name, phone")
      .single();

    if (error) {
      throw new Error("account.errors.profileUpdateFailed");
    }

    return {
      ...profile,
      displayName: data?.display_name ?? profile.displayName,
      phone: data?.phone ?? null,
    };
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

  private translatePasswordError(error: AuthApiError | Error): string {
    const message = error.message?.toLowerCase?.() ?? "";

    if (message.includes("invalid") || message.includes("credentials")) {
      return "account.errors.currentPasswordInvalid";
    }

    return "account.errors.passwordUpdateFailed";
  }
}
