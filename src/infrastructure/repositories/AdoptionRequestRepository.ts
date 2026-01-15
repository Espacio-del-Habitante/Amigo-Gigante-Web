import type {
  AdoptionRequestAdopterProfile,
  AdoptionRequestDetail,
  AdoptionRequestPriority,
  AdoptionRequestStatus,
  AdoptionRequestSummary,
} from "@/domain/models/AdoptionRequest";
import type { AdoptionRequestDocument, AdoptionRequestDocumentType } from "@/domain/models/AdoptionRequestDocument";
import type {
  GetAdoptionRequestsParams,
  GetAdoptionRequestsResult,
  IAdoptionRequestRepository,
  UpdateAdoptionRequestStatusParams,
} from "@/domain/repositories/IAdoptionRequestRepository";
import { supabaseClient } from "@/infrastructure/config/supabase";

interface AdoptionRequestDetailsRow {
  adopter_display_name: string | null;
  adopter_phone: string | null;
  adopter_email: string | null;
  city: string | null;
  neighborhood: string | null;
  housing_type: AdoptionRequestAdopterProfile["housingType"];
  is_rent: boolean | null;
  allows_pets: boolean | null;
  household_people_count: number | null;
  has_children: boolean | null;
  children_ages: string | null;
  has_other_pets: boolean | null;
  other_pets_description: string | null;
  hours_alone_per_day: number | null;
  travel_plan: string | null;
  experience_text: string | null;
  motivation_text: string | null;
  accepts_vet_costs: boolean | null;
  accepts_lifetime_commitment: boolean | null;
}

interface AdoptionRequestAnimalRow {
  id: number;
  name: string | null;
  species: AdoptionRequestDetail["animal"]["species"];
  breed: string | null;
  sex: AdoptionRequestDetail["animal"]["sex"];
  age_months: number | null;
  size: AdoptionRequestDetail["animal"]["size"];
  cover_image_url: string | null;
}

interface AdoptionRequestRow {
  id: number;
  status: AdoptionRequestStatus;
  priority: number | null;
  rejection_reason: string | null;
  created_at: string;
  adoption_request_details: AdoptionRequestDetailsRow | AdoptionRequestDetailsRow[] | null;
  animals: AdoptionRequestAnimalRow | AdoptionRequestAnimalRow[] | null;
}

interface AdoptionRequestDocumentRow {
  id: number;
  request_id: number;
  doc_type: AdoptionRequestDocumentType;
  file_url: string;
  notes: string | null;
  created_at: string;
}

const PRIORITY_VALUE_MAP: Record<AdoptionRequestPriority, number> = {
  low: 0,
  medium: 1,
  high: 2,
};

export class AdoptionRequestRepository implements IAdoptionRequestRepository {
  async getAdminRequests({ foundationId, filters, pagination }: GetAdoptionRequestsParams): Promise<GetAdoptionRequestsResult> {
    const pageSize = pagination.pageSize;
    const from = Math.max(0, (pagination.page - 1) * pageSize);
    const to = Math.max(from, from + pageSize - 1);

    let query = supabaseClient
      .from("adoption_requests")
      .select(
        `id,
        status,
        priority,
        rejection_reason,
        created_at,
        adoption_request_details (adopter_display_name),
        animals (id, name, cover_image_url)`,
        { count: "exact" },
      )
      .eq("foundation_id", foundationId)
      .order("created_at", { ascending: false })
      .range(from, to);

    if (filters?.status) {
      query = query.eq("status", filters.status);
    }

    if (filters?.priority) {
      query = query.eq("priority", PRIORITY_VALUE_MAP[filters.priority]);
    }

    const search = filters?.search?.trim();
    if (search) {
      query = query.or(
        `animals.name.ilike.%${search}%,adoption_request_details.adopter_display_name.ilike.%${search}%`,
      );
    }

    const { data, error, count } = await query.returns<AdoptionRequestRow[]>();

    if (error) {
      throw new Error(this.translateAdoptionRequestError(error));
    }

    return {
      requests: (data ?? []).map((row) => this.mapSummary(row)),
      total: count ?? 0,
    };
  }

  async getRequestDetail({ foundationId, requestId }: Parameters<IAdoptionRequestRepository["getRequestDetail"]>[0]) {
    const { data, error } = await supabaseClient
      .from("adoption_requests")
      .select(
        `id,
        status,
        priority,
        rejection_reason,
        created_at,
        adoption_request_details (
          adopter_display_name,
          adopter_phone,
          adopter_email,
          city,
          neighborhood,
          housing_type,
          is_rent,
          allows_pets,
          household_people_count,
          has_children,
          children_ages,
          has_other_pets,
          other_pets_description,
          hours_alone_per_day,
          travel_plan,
          experience_text,
          motivation_text,
          accepts_vet_costs,
          accepts_lifetime_commitment
        ),
        animals (
          id,
          name,
          species,
          breed,
          sex,
          age_months,
          size,
          cover_image_url
        )`,
      )
      .eq("foundation_id", foundationId)
      .eq("id", requestId)
      .single()
      .returns<AdoptionRequestRow>();

    if (error) {
      throw new Error(this.translateAdoptionRequestError(error));
    }

    if (!data) {
      throw new Error("errors.notFound");
    }

    const { data: documents, error: documentsError } = await supabaseClient
      .from("adoption_request_documents")
      .select("id, request_id, doc_type, file_url, notes, created_at")
      .eq("request_id", requestId)
      .order("created_at", { ascending: false })
      .returns<AdoptionRequestDocumentRow[]>();

    if (documentsError) {
      throw new Error(this.translateAdoptionRequestError(documentsError));
    }

    return this.mapDetail(data, documents ?? []);
  }

  async updateStatus({ foundationId, requestId, status, rejectionReason }: UpdateAdoptionRequestStatusParams): Promise<void> {
    const { data, error } = await supabaseClient
      .from("adoption_requests")
      .update({
        status,
        rejection_reason: status === "rejected" ? rejectionReason ?? null : null,
      })
      .eq("id", requestId)
      .eq("foundation_id", foundationId)
      .select("id")
      .single();

    if (error) {
      throw new Error(this.translateAdoptionRequestError(error));
    }

    if (!data) {
      throw new Error("errors.notFound");
    }
  }

  private mapSummary(row: AdoptionRequestRow): AdoptionRequestSummary {
    const detail = this.normalizeDetails(row.adoption_request_details);
    const animal = this.normalizeAnimal(row.animals);

    return {
      id: row.id,
      status: row.status,
      priority: this.normalizePriority(row.priority),
      createdAt: row.created_at,
      animal: {
        id: animal?.id ?? 0,
        name: animal?.name ?? "",
        coverImageUrl: animal?.cover_image_url ?? null,
      },
      adopter: {
        displayName: detail?.adopter_display_name ?? "",
      },
    };
  }

  private mapDetail(row: AdoptionRequestRow, documents: AdoptionRequestDocumentRow[]): AdoptionRequestDetail {
    const detail = this.normalizeDetails(row.adoption_request_details);
    const animal = this.normalizeAnimal(row.animals);

    if (!animal) {
      throw new Error("errors.notFound");
    }

    return {
      id: row.id,
      status: row.status,
      priority: this.normalizePriority(row.priority),
      rejectionReason: row.rejection_reason ?? null,
      createdAt: row.created_at,
      adopterProfile: {
        displayName: detail?.adopter_display_name ?? "",
        phone: detail?.adopter_phone ?? null,
        email: detail?.adopter_email ?? null,
        city: detail?.city ?? null,
        neighborhood: detail?.neighborhood ?? null,
        housingType: detail?.housing_type ?? null,
        isRent: detail?.is_rent ?? null,
        allowsPets: detail?.allows_pets ?? null,
        householdPeopleCount: detail?.household_people_count ?? null,
        hasChildren: detail?.has_children ?? null,
        childrenAges: detail?.children_ages ?? null,
        hasOtherPets: detail?.has_other_pets ?? null,
        otherPetsDescription: detail?.other_pets_description ?? null,
        hoursAlonePerDay: detail?.hours_alone_per_day ?? null,
        travelPlan: detail?.travel_plan ?? null,
        experienceText: detail?.experience_text ?? null,
        motivationText: detail?.motivation_text ?? null,
        acceptsVetCosts: detail?.accepts_vet_costs ?? null,
        acceptsLifetimeCommitment: detail?.accepts_lifetime_commitment ?? null,
      },
      animal: {
        id: animal.id,
        name: animal.name ?? "",
        species: animal.species ?? "other",
        breed: animal.breed ?? null,
        sex: animal.sex ?? "unknown",
        ageMonths: animal.age_months ?? null,
        size: animal.size ?? "unknown",
        coverImageUrl: animal.cover_image_url ?? null,
      },
      documents: documents.map(this.mapDocument),
    };
  }

  private mapDocument(document: AdoptionRequestDocumentRow): AdoptionRequestDocument {
    return {
      id: document.id,
      requestId: document.request_id,
      docType: document.doc_type,
      fileUrl: document.file_url,
      notes: document.notes ?? null,
      createdAt: document.created_at,
    };
  }

  private normalizeDetails(
    details: AdoptionRequestDetailsRow | AdoptionRequestDetailsRow[] | null,
  ): AdoptionRequestDetailsRow | null {
    if (!details) return null;
    if (Array.isArray(details)) {
      return details[0] ?? null;
    }
    return details;
  }

  private normalizeAnimal(
    animal: AdoptionRequestAnimalRow | AdoptionRequestAnimalRow[] | null,
  ): AdoptionRequestAnimalRow | null {
    if (!animal) return null;
    if (Array.isArray(animal)) {
      return animal[0] ?? null;
    }
    return animal;
  }

  private normalizePriority(priority: number | null | undefined): AdoptionRequestPriority {
    if (priority === null || priority === undefined) {
      return "low";
    }
    if (priority >= PRIORITY_VALUE_MAP.high) {
      return "high";
    }
    if (priority === PRIORITY_VALUE_MAP.medium) {
      return "medium";
    }
    return "low";
  }

  private translateAdoptionRequestError(error: { message?: string; code?: string }): string {
    const message = error.message?.toLowerCase?.() ?? "";
    const code = error.code?.toLowerCase?.() ?? "";

    if (code === "pgrst116" || message.includes("no rows") || message.includes("0 rows")) {
      return "errors.notFound";
    }

    if (message.includes("permission") || message.includes("row level")) {
      return "errors.unauthorized";
    }

    if (message.includes("connection") || message.includes("network")) {
      return "errors.connection";
    }

    return "errors.generic";
  }
}
