import type { PostgrestError } from "@supabase/supabase-js";

import type { IFoundationMembershipRepository } from "@/domain/repositories/IFoundationMembershipRepository";
import { supabaseClient } from "@/infrastructure/config/supabase";

interface FoundationMembershipRow {
  foundation_id: string;
  member_role: string | null;
}

class FoundationMembershipRepository implements IFoundationMembershipRepository {
  async getFoundationIdForUser(userId: string): Promise<string> {
    const { data, error } = await supabaseClient
      .from("foundation_members")
      .select("foundation_id, member_role")
      .eq("user_id", userId)
      .limit(1)
      .maybeSingle<FoundationMembershipRow>();

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

  private isAllowedRole(memberRole: string): boolean {
    return memberRole === "owner" || memberRole === "editor";
  }
}

export { FoundationMembershipRepository };

