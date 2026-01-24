import type { PostgrestError } from "@supabase/supabase-js";

import type {
  CreateFoundationContactParams,
  CreateFoundationMemberParams,
  CreateFoundationParams,
  IFoundationRepository,
} from "@/domain/repositories/IFoundationRepository";
import type { FeaturedFoundation } from "@/domain/models/FeaturedFoundation";
import type { Foundation } from "@/domain/models/Foundation";
import type { FoundationContact } from "@/domain/models/FoundationContact";
import type { ShopFoundation } from "@/domain/models/ShopFoundation";
import { supabaseClient } from "@/infrastructure/config/supabase";

class FoundationRepository implements IFoundationRepository {
  async createFoundation(params: CreateFoundationParams): Promise<Foundation> {
    const { name, taxId } = params;
    // La tabla foundations NO tiene columna tax_id, solo se guarda en foundation_contacts
    const basePayload = { name };

    try {
      const { data, error } = await supabaseClient
        .from("foundations")
        .insert(basePayload)
        .select("id, name")
        .single();

      if (error) {
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

  async getFeaturedFoundations(limit: number): Promise<FeaturedFoundation[]> {
    type FeaturedFoundationRow = {
      foundation_id: string | null;
      foundations:
        | {
            id: string;
            name: string | null;
            city: string | null;
            country: string | null;
            logo_url: string | null;
          }
        | {
            id: string;
            name: string | null;
            city: string | null;
            country: string | null;
            logo_url: string | null;
          }[]
        | null;
      count: number | null;
    };

    const { data, error } = await supabaseClient
      .from("animals")
      .select("foundation_id, foundations(id, name, city, country, logo_url), count:foundation_id")
      .eq("is_published", true)
      .not("foundation_id", "is", null)
      .order("count", { ascending: false })
      .limit(limit)
      .returns<FeaturedFoundationRow[]>();

    if (error) {
      throw new Error(this.translateFoundationLookupError(error));
    }

    return (data ?? [])
      .map((row) => {
        const foundationValue = row.foundations;
        const foundation = Array.isArray(foundationValue) ? foundationValue[0] : foundationValue;
        if (!foundation && !row.foundation_id) {
          return null;
        }

        return {
          id: foundation?.id ?? row.foundation_id ?? "",
          name: foundation?.name ?? "",
          logoUrl: foundation?.logo_url ?? null,
          city: foundation?.city ?? null,
          country: foundation?.country ?? null,
          animalsCount: Number(row.count ?? 0),
        };
      })
      .filter((foundation): foundation is FeaturedFoundation => Boolean(foundation?.id));
  }

  async getShopFoundationById(foundationId: string): Promise<ShopFoundation> {
    const { data, error } = await supabaseClient
      .from("foundations")
      .select("id, name, city, country, logo_url")
      .eq("id", foundationId)
      .single()
      .returns<{ id: string; name: string | null; city: string | null; country: string | null; logo_url: string | null }>();

    if (error || !data) {
      throw new Error(this.translateFoundationLookupError(error ?? new Error("not found")));
    }

    return {
      id: data.id,
      name: data.name ?? "",
      city: data.city ?? null,
      country: data.country ?? null,
      logoUrl: data.logo_url ?? null,
    };
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

    // Intentar obtener el contacto de la fundación
    const { data: contactData, error: contactError } = await supabaseClient
      .from("foundation_contacts")
      .select("foundation_id, public_email, public_phone, instagram_url, whatsapp_url, address, foundations(name)")
      .eq("foundation_id", foundationId)
      .maybeSingle()
      .returns<FoundationContactRow>();

    // Si hay un error que no sea "no encontrado", lanzar error
    if (contactError && contactError.code !== "PGRST116") {
      throw new Error(this.translateFoundationLookupError(contactError));
    }

    // Si hay datos de contacto, usarlos
    if (contactData) {
      const foundationValue = contactData.foundations;
      const foundationName = Array.isArray(foundationValue)
        ? (foundationValue[0]?.name ?? "")
        : (foundationValue?.name ?? "");

      return {
        foundationId: contactData.foundation_id,
        foundationName,
        publicEmail: contactData.public_email ?? null,
        publicPhone: contactData.public_phone ?? null,
        instagramUrl: contactData.instagram_url ?? null,
        whatsappUrl: contactData.whatsapp_url ?? null,
        address: contactData.address ?? null,
      };
    }

    // Si no hay contacto, obtener al menos el nombre de la fundación
    const { data: foundationData, error: foundationError } = await supabaseClient
      .from("foundations")
      .select("id, name")
      .eq("id", foundationId)
      .maybeSingle<{ id: string; name: string | null }>();

    if (foundationError) {
      throw new Error(this.translateFoundationLookupError(foundationError));
    }

    if (!foundationData) {
      throw new Error("errors.notFound");
    }

    // Devolver contacto con valores null pero con el nombre de la fundación
    return {
      foundationId: foundationData.id,
      foundationName: foundationData.name ?? "",
      publicEmail: null,
      publicPhone: null,
      instagramUrl: null,
      whatsappUrl: null,
      address: null,
    };
  }

  async rollbackFoundation(foundationId: string): Promise<void> {
    await supabaseClient.from("foundations").delete().eq("id", foundationId);
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
