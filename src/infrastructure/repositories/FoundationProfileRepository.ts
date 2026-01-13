import type { PostgrestError } from "@supabase/supabase-js";

import type { FoundationProfile } from "@/domain/models/FoundationProfile";
import type { IFoundationProfileRepository } from "@/domain/repositories/IFoundationProfileRepository";
import { supabaseClient } from "@/infrastructure/config/supabase";

interface FoundationRow {
  id: string;
  name: string | null;
  description: string | null;
  logo_url: string | null;
  city: string | null;
  country: string | null;
}

interface FoundationContactRow {
  foundation_id: string;
  public_email: string | null;
  public_phone: string | null;
  instagram_url: string | null;
  whatsapp_url: string | null;
  address: string | null;
}

class FoundationProfileRepository implements IFoundationProfileRepository {
  async getFoundationProfile(): Promise<FoundationProfile> {
    const userId = await this.getAuthenticatedUserId();
    const foundationId = await this.getFoundationIdForUser(userId);
    const foundation = await this.getFoundation(foundationId);
    const contact = await this.getFoundationContact(foundationId);

    return this.mapToFoundationProfile(foundationId, foundation, contact);
  }

  async updateFoundationProfile(profile: FoundationProfile): Promise<FoundationProfile> {
    const userId = await this.getAuthenticatedUserId();
    const foundationId = await this.getFoundationIdForUser(userId);

    if (foundationId !== profile.foundationId) {
      throw new Error("errors.unauthorized");
    }

    await this.updateFoundation(foundationId, profile);
    await this.upsertFoundationContact(foundationId, profile);

    return this.getFoundationProfile();
  }

  private async getAuthenticatedUserId(): Promise<string> {
    const { data, error } = await supabaseClient.auth.getUser();

    if (error || !data.user) {
      throw new Error("errors.unauthorized");
    }

    return data.user.id;
  }

  private async getFoundationIdForUser(userId: string): Promise<string> {
    const { data, error } = await supabaseClient
      .from("foundation_members")
      .select("foundation_id, member_role")
      .eq("user_id", userId)
      .limit(1)
      .maybeSingle();

    if (error) {
      throw new Error(this.translateMembershipError(error));
    }

    if (!data?.foundation_id) {
      throw new Error("errors.unauthorized");
    }

    if (data.member_role && !this.isAllowedRole(data.member_role)) {
      throw new Error("errors.unauthorized");
    }

    return data.foundation_id;
  }

  private async getFoundation(foundationId: string): Promise<FoundationRow> {
    const { data, error } = await supabaseClient
      .from("foundations")
      .select("id, name, description, logo_url, city, country")
      .eq("id", foundationId)
      .single();

    if (error || !data) {
      throw new Error(this.translateFoundationError(error));
    }

    return data;
  }

  private async getFoundationContact(foundationId: string): Promise<FoundationContactRow | null> {
    const { data, error } = await supabaseClient
      .from("foundation_contacts")
      .select("foundation_id, public_email, public_phone, instagram_url, whatsapp_url, address")
      .eq("foundation_id", foundationId)
      .maybeSingle();

    if (error) {
      throw new Error(this.translateContactError(error));
    }

    return data ?? null;
  }

  private async updateFoundation(foundationId: string, profile: FoundationProfile): Promise<void> {
    const { error } = await supabaseClient
      .from("foundations")
      .update({
        name: profile.name,
        description: profile.description,
        logo_url: profile.logoUrl,
        city: profile.city,
        country: profile.country,
      })
      .eq("id", foundationId);

    if (error) {
      throw new Error(this.translateFoundationError(error));
    }
  }

  private async upsertFoundationContact(
    foundationId: string,
    profile: FoundationProfile,
  ): Promise<void> {
    const { error } = await supabaseClient.from("foundation_contacts").upsert(
      {
        foundation_id: foundationId,
        public_email: profile.publicEmail || null,
        public_phone: profile.publicPhone || null,
        instagram_url: profile.instagramUrl || null,
        whatsapp_url: profile.whatsappUrl || null,
        address: profile.address || null,
      },
      { onConflict: "foundation_id" },
    );

    if (error) {
      throw new Error(this.translateContactError(error));
    }
  }

  private mapToFoundationProfile(
    foundationId: string,
    foundation: FoundationRow,
    contact: FoundationContactRow | null,
  ): FoundationProfile {
    return {
      foundationId,
      name: foundation.name ?? "",
      description: foundation.description ?? "",
      logoUrl: foundation.logo_url ?? null,
      city: foundation.city ?? "",
      country: foundation.country ?? "",
      address: contact?.address ?? "",
      publicEmail: contact?.public_email ?? "",
      publicPhone: contact?.public_phone ?? "",
      instagramUrl: contact?.instagram_url ?? "",
      whatsappUrl: contact?.whatsapp_url ?? "",
    };
  }

  private translateMembershipError(error: PostgrestError): string {
    const message = error.message?.toLowerCase?.() ?? "";

    if (message.includes("permission") || message.includes("row level")) {
      return "errors.unauthorized";
    }

    if (message.includes("connection")) {
      return "errors.connection";
    }

    return "errors.generic";
  }

  private translateFoundationError(error?: PostgrestError | null): string {
    const message = error?.message?.toLowerCase?.() ?? "";

    if (message.includes("permission") || message.includes("row level")) {
      return "errors.unauthorized";
    }

    if (message.includes("not found")) {
      return "errors.notFound";
    }

    if (message.includes("connection")) {
      return "errors.connection";
    }

    return "errors.generic";
  }

  private translateContactError(error?: PostgrestError | null): string {
    const message = error?.message?.toLowerCase?.() ?? "";

    if (message.includes("permission") || message.includes("row level")) {
      return "errors.unauthorized";
    }

    if (message.includes("connection")) {
      return "errors.connection";
    }

    return "errors.generic";
  }

  private isAllowedRole(memberRole: string): boolean {
    return memberRole === "owner" || memberRole === "editor";
  }
}

export { FoundationProfileRepository };
