import type { PostgrestError } from "@supabase/supabase-js";

import type {
  CreateFoundationContactParams,
  CreateFoundationMemberParams,
  CreateFoundationParams,
  IFoundationRepository,
} from "@/domain/repositories/IFoundationRepository";
import type { Foundation } from "@/domain/models/Foundation";
import type { FoundationContact } from "@/domain/models/FoundationContact";
import type { ShopFoundation } from "@/domain/models/ShopFoundation";
import { supabaseClient } from "@/infrastructure/config/supabase";

class FoundationRepository implements IFoundationRepository {
  async createFoundation(params: CreateFoundationParams): Promise<Foundation> {
    const { name, taxId } = params;
    const basePayload = this.buildFoundationPayload(name, taxId);

    try {
      const { data, error } = await supabaseClient
        .from("foundations")
        .insert(basePayload)
        .select("id, name")
        .single();

      if (error) {
        if (taxId && this.isMissingTaxIdColumn(error)) {
          return this.createFoundationWithoutTaxId(name);
        }

        throw new Error(this.translateFoundationError(error));
      }

      if (!data) {
        throw new Error("La fundación no se pudo crear en la base de datos.");
      }

      return { id: data.id, name: data.name, taxId: taxId ?? null };
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(this.translateFoundationError(error));
      }

      throw new Error("No se pudo crear la fundación. Inténtalo nuevamente.");
    }
  }

  async createFoundationContact(params: CreateFoundationContactParams): Promise<void> {
    const { foundationId, officialEmail, taxId } = params;

    try {
      const { error } = await supabaseClient.from("foundation_contacts").insert({
        foundation_id: foundationId,
        public_email: officialEmail,
        address: taxId ? `Tax ID: ${taxId}` : null,
      });

      if (error) {
        throw new Error(this.translateContactError(error));
      }
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(this.translateContactError(error));
      }

      throw new Error("No se pudo registrar el contacto de la fundación.");
    }
  }

  async createFoundationMember(params: CreateFoundationMemberParams): Promise<void> {
    const { foundationId, userId, memberRole } = params;

    try {
      const { error } = await supabaseClient.from("foundation_members").insert({
        foundation_id: foundationId,
        user_id: userId,
        member_role: memberRole,
      });

      if (error) {
        throw new Error(this.translateMemberError(error));
      }
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(this.translateMemberError(error));
      }

      throw new Error("No se pudo asignar al usuario como miembro de la fundación.");
    }
  }

  async getFoundationById(foundationId: string): Promise<Foundation> {
    const { data, error } = await supabaseClient
      .from("foundations")
      .select("id, name")
      .eq("id", foundationId)
      .single();

    if (error || !data) {
      throw new Error(this.translateFoundationLookupError(error ?? new Error("not found")));
    }

    return { id: data.id, name: data.name ?? "", taxId: null };
  }

  async getFoundationsList(): Promise<ShopFoundation[]> {
    const { data, error } = await supabaseClient
      .from("foundations")
      .select("id, name, city, country, logo_url")
      .returns<Array<{ id: string; name: string | null; city: string | null; country: string | null; logo_url: string | null }>>();

    if (error) {
      throw new Error(this.translateFoundationLookupError(error));
    }

    return (data ?? []).map((row) => ({
      id: row.id,
      name: row.name ?? "",
      city: row.city ?? null,
      country: row.country ?? null,
      logoUrl: row.logo_url ?? null,
    }));
  }

  async getFoundationContacts(foundationId: string): Promise<FoundationContact> {
    type FoundationContactRow = {
      foundation_id: string;
      public_email: string | null;
      public_phone: string | null;
      instagram_url: string | null;
      whatsapp_url: string | null;
      address: string | null;
      foundations: { name: string | null } | { name: string | null }[] | null;
    };

    const { data, error } = await supabaseClient
      .from("foundation_contacts")
      .select("foundation_id, public_email, public_phone, instagram_url, whatsapp_url, address, foundations(name)")
      .eq("foundation_id", foundationId)
      .single()
      .returns<FoundationContactRow>();

    if (error || !data) {
      throw new Error(this.translateFoundationLookupError(error ?? new Error("not found")));
    }

    const foundationValue = data.foundations;
    const foundationName = Array.isArray(foundationValue)
      ? (foundationValue[0]?.name ?? "")
      : (foundationValue?.name ?? "");

    return {
      foundationId: data.foundation_id,
      foundationName,
      publicEmail: data.public_email ?? null,
      publicPhone: data.public_phone ?? null,
      instagramUrl: data.instagram_url ?? null,
      whatsappUrl: data.whatsapp_url ?? null,
      address: data.address ?? null,
    };
  }

  async rollbackFoundation(foundationId: string): Promise<void> {
    await supabaseClient.from("foundations").delete().eq("id", foundationId);
  }

  private buildFoundationPayload(name: string, taxId?: string) {
    if (taxId) {
      return { name, tax_id: taxId };
    }

    return { name };
  }

  private isMissingTaxIdColumn(error: PostgrestError): boolean {
    return error.message?.toLowerCase?.().includes('column "tax_id"');
  }

  private async createFoundationWithoutTaxId(name: string): Promise<Foundation> {
    const { data, error } = await supabaseClient
      .from("foundations")
      .insert({ name })
      .select("id, name")
      .single();

    if (error || !data) {
      throw new Error(this.translateFoundationError(error ?? new Error("No se pudo crear la fundación.")));
    }

    return { id: data.id, name: data.name, taxId: null };
  }

  private translateFoundationError(error: PostgrestError | Error): string {
    const message = error.message?.toLowerCase?.() ?? "";

    if (message.includes("connection")) {
      return "No se pudo conectar con el servidor para crear la fundación. Inténtalo más tarde.";
    }

    return "No se pudo crear la fundación. Verifica los datos e inténtalo nuevamente.";
  }

  private translateContactError(error: PostgrestError | Error): string {
    const message = error.message?.toLowerCase?.() ?? "";

    if (message.includes("unique")) {
      return "Ya existe un contacto registrado para esta fundación.";
    }

    if (message.includes("connection")) {
      return "No se pudo conectar para guardar el contacto de la fundación.";
    }

    return "No se pudo guardar el contacto de la fundación. Inténtalo nuevamente.";
  }

  private translateMemberError(error: PostgrestError | Error): string {
    const message = error.message?.toLowerCase?.() ?? "";

    if (message.includes("unique")) {
      return "El usuario ya está registrado como miembro de esta fundación.";
    }

    if (message.includes("connection")) {
      return "No se pudo conectar para guardar el miembro de la fundación.";
    }

    return "No se pudo guardar el miembro de la fundación. Inténtalo nuevamente.";
  }

  private translateFoundationLookupError(error: PostgrestError | Error): string {
    const message = error.message?.toLowerCase?.() ?? "";
    const code = (error as PostgrestError).code?.toLowerCase?.() ?? "";

    if (message.includes("permission") || message.includes("row level")) {
      return "errors.unauthorized";
    }

    if (code === "pgrst116" || message.includes("no rows") || message.includes("0 rows") || message.includes("not found")) {
      return "errors.notFound";
    }

    if (message.includes("connection") || message.includes("network")) {
      return "errors.connection";
    }

    return "errors.generic";
  }
}

export { FoundationRepository };
