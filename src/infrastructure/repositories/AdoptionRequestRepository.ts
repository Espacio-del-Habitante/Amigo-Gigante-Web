import type {
  AdoptionRequest,
  AdoptionRequestAdopterProfile,
  AdoptionRequestDetail,
  AdoptionRequestDetails,
  AdoptionRequestDocuments,
  AdoptionRequestPriority,
  AdoptionRequestStatus,
  AdoptionRequestSummary,
  AdoptionRequestMessage,
} from "@/domain/models/AdoptionRequest";
import type { AdoptionRequestDocument, AdoptionRequestDocumentType } from "@/domain/models/AdoptionRequestDocument";
import type {
  CreateAdoptionRequestParams,
  EnqueueInfoRequestEmailParams,
  GetAdopterEmailByUserIdParams,
  GetAdoptionRequestsParams,
  GetAdoptionRequestsResult,
  GetUserAdoptionRequestsParams,
  GetUserAdoptionRequestsResult,
  IAdoptionRequestRepository,
  AdoptionRequestsCounts,
  UpdateAdoptionRequestStatusParams,
  SaveResponseMessageParams,
  GetRequestMessagesParams,
  NotifyFoundationMembersParams,
} from "@/domain/repositories/IAdoptionRequestRepository";
import type { IPrivateFileStorage } from "@/domain/repositories/IPrivateFileStorage";
import { supabaseClient } from "@/infrastructure/config/supabase";
import { PrivateFileStorage } from "@/infrastructure/repositories/PrivateFileStorage";

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

interface AdoptionRequestMessageRow {
  id: number;
  request_id: number;
  sender_user_id: string;
  sender_role: "foundation" | "adopter";
  message_text: string;
  created_at: string;
}


interface AdoptionRequestFoundationRow {
  id: string;
  name: string | null;
}

interface AdoptionRequestUserRow {
  id: number;
  status: AdoptionRequestStatus;
  created_at: string;
  animals: AdoptionRequestAnimalRow | AdoptionRequestAnimalRow[] | null;
  foundations: AdoptionRequestFoundationRow | AdoptionRequestFoundationRow[] | null;
}

const PRIORITY_VALUE_MAP: Record<AdoptionRequestPriority, number> = {
  low: 0,
  medium: 1,
  high: 2,
};

export class AdoptionRequestRepository implements IAdoptionRequestRepository {
  private readonly privateFileStorage: IPrivateFileStorage = new PrivateFileStorage();

  async createAdoptionRequest(params: CreateAdoptionRequestParams): Promise<AdoptionRequest> {
    const { animalId, foundationId, adopterUserId, details, documents } = params;

    if (!documents?.idDocument || documents.homePhotos.length === 0) {
      throw new Error("errors.documentsRequired");
    }

    await this.ensureAdopterProfile(adopterUserId);

    const request = await this.insertRequest({
      animalId,
      foundationId,
      adopterUserId,
    });

    try {
      await this.insertDetails(request.id, details);
      await this.uploadDocuments({
        requestId: request.id,
        foundationId,
        documents,
      });
    } catch (error) {
      await this.rollbackRequest(request.id);
      throw error;
    }

    return request;
  }

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
      throw new Error(this.translateAdoptionError(error));
    }

    return {
      requests: (data ?? []).map((row) => this.mapSummary(row)),
      total: count ?? 0,
    };
  }

  async getUserRequests(params: GetUserAdoptionRequestsParams): Promise<GetUserAdoptionRequestsResult> {
    const { adopterUserId } = params;
    const { data, error } = await supabaseClient
      .from("adoption_requests")
      .select(
        `id,
        status,
        created_at,
        animals (id, name, species, cover_image_url),
        foundations (id, name)`,
      )
      .eq("adopter_user_id", adopterUserId)
      .order("created_at", { ascending: false })
      .returns<AdoptionRequestUserRow[]>();

    if (error) {
      throw new Error(this.translateAdoptionError(error));
    }

    return {
      requests: (data ?? []).map((row) => this.mapUserSummary(row)),
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
      throw new Error(this.translateAdoptionError(error));
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
      throw new Error(this.translateAdoptionError(documentsError));
    }

    return this.mapDetail(data, documents ?? []);
  }

  async getRequestAccessInfo(
    params: Parameters<IAdoptionRequestRepository["getRequestAccessInfo"]>[0],
  ) {
    const { requestId } = params;
    const { data, error } = await supabaseClient
      .from("adoption_requests")
      .select("id, foundation_id, adopter_user_id")
      .eq("id", requestId)
      .single();

    if (error) {
      throw new Error(this.translateAdoptionError(error));
    }

    if (!data) {
      throw new Error("errors.notFound");
    }

    return {
      requestId: data.id,
      foundationId: data.foundation_id,
      adopterUserId: data.adopter_user_id,
    };
  }

  async getRequestMessages({ requestId }: GetRequestMessagesParams): Promise<AdoptionRequestMessage[]> {
    const { data, error } = await supabaseClient
      .from("adoption_request_messages")
      .select("id, request_id, sender_user_id, sender_role, message_text, created_at")
      .eq("request_id", requestId)
      .order("created_at", { ascending: true })
      .returns<AdoptionRequestMessageRow[]>();

    if (error) {
      throw new Error(this.translateAdoptionError(error));
    }

    const { data: documents, error: documentsError } = await supabaseClient
      .from("adoption_request_documents")
      .select("id, request_id, doc_type, file_url, notes, created_at")
      .eq("request_id", requestId)
      .eq("doc_type", "response")
      .returns<AdoptionRequestDocumentRow[]>();

    if (documentsError) {
      throw new Error(this.translateAdoptionError(documentsError));
    }

    const documentsByMessageId = new Map<number, AdoptionRequestMessage["files"]>();

    (documents ?? []).forEach((document) => {
      const messageId = this.extractMessageId(document.notes);
      if (!messageId) return;
      const current = documentsByMessageId.get(messageId) ?? [];
      current.push({
        id: document.id,
        fileUrl: document.file_url,
        docType: document.doc_type,
      });
      documentsByMessageId.set(messageId, current);
    });

    return (data ?? []).map((row) => ({
      id: row.id,
      senderUserId: row.sender_user_id,
      senderRole: row.sender_role,
      messageText: row.message_text,
      createdAt: row.created_at,
      files: documentsByMessageId.get(row.id) ?? [],
    }));
  }

  async getAdopterEmailByUserId({ adopterUserId }: GetAdopterEmailByUserIdParams): Promise<string | null> {
    const { data, error } = await supabaseClient
      .from("auth.users")
      .select("email")
      .eq("id", adopterUserId)
      .maybeSingle();

    if (error) {
      throw new Error(this.translateAdoptionError(error));
    }

    return data?.email ?? null;
  }

  async enqueueInfoRequestEmail(params: EnqueueInfoRequestEmailParams): Promise<void> {
    const { error } = await supabaseClient.from("email_queue").insert({
      user_id: params.adopterUserId,
      to_email: params.toEmail,
      template: "info_requested",
      payload: {
        request_id: params.requestId,
        animal_id: params.animalId,
        foundation_id: params.foundationId,
        animal_name: params.animalName,
        subject: params.subject,
        message: params.message,
      },
      status: "pending",
    });

    if (error) {
      throw new Error(this.translateAdoptionError(error));
    }
  }

  async saveResponseMessage(params: SaveResponseMessageParams): Promise<void> {
    const { data: message, error: messageError } = await supabaseClient
      .from("adoption_request_messages")
      .insert({
        request_id: params.requestId,
        sender_user_id: params.senderUserId,
        sender_role: params.senderRole,
        message_text: params.messageText,
      })
      .select("id")
      .single<{ id: number }>();

    if (messageError) {
      throw new Error(this.translateAdoptionError(messageError));
    }

    if (!message) {
      throw new Error("errors.generic");
    }

    if (params.fileUrls.length > 0) {
      const documents = params.fileUrls.map((url) => ({
        request_id: params.requestId,
        doc_type: "response",
        file_url: url,
        notes: `Response message ID: ${message.id}`,
      }));

      const { error: docsError } = await supabaseClient
        .from("adoption_request_documents")
        .insert(documents);

      if (docsError) {
        throw new Error(this.translateAdoptionError(docsError));
      }
    }
  }

  async notifyFoundationMembers(params: NotifyFoundationMembersParams): Promise<void> {
    const { foundationId, actorUserId, title, body, type, data } = params;
    const { error } = await supabaseClient.rpc("notify_foundation_members", {
      p_foundation_id: foundationId,
      p_actor_user_id: actorUserId,
      p_title: title,
      p_body: body,
      p_type: type,
      p_data: data,
    });

    if (error) {
      throw new Error(this.translateAdoptionError(error));
    }
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
      throw new Error(this.translateAdoptionError(error));
    }

    if (!data) {
      throw new Error("errors.notFound");
    }
  }

  async getAdoptionRequestsCounts(params: GetAdoptionRequestsCountsParams): Promise<AdoptionRequestsCounts> {
    const { foundationId } = params;

    const { count: total, error: totalError } = await supabaseClient
      .from("adoption_requests")
      .select("*", { count: "exact", head: true })
      .eq("foundation_id", foundationId);

    if (totalError) {
      throw new Error(this.translateAdoptionError(totalError));
    }

    const { data, error } = await supabaseClient
      .from("adoption_requests")
      .select("status")
      .eq("foundation_id", foundationId);

    if (error) {
      throw new Error(this.translateAdoptionError(error));
    }

    const byStatus: AdoptionRequestsCounts["byStatus"] = {
      pending: 0,
      in_review: 0,
      info_requested: 0,
      preapproved: 0,
      approved: 0,
      rejected: 0,
      cancelled: 0,
      completed: 0,
    };

    (data ?? []).forEach((row) => {
      const status = row.status as keyof typeof byStatus;
      if (status in byStatus) {
        byStatus[status] += 1;
      }
    });

    return {
      total: total ?? 0,
      byStatus,
    };
  }

  private async insertRequest(params: {
    animalId: number;
    foundationId: string;
    adopterUserId: string;
  }): Promise<AdoptionRequest> {
    const { animalId, foundationId, adopterUserId } = params;
    const { data, error } = await supabaseClient
      .from("adoption_requests")
      .insert({
        animal_id: animalId,
        foundation_id: foundationId,
        adopter_user_id: adopterUserId,
        status: "pending",
      })
      .select("id, animal_id, foundation_id, adopter_user_id, status")
      .single();

    if (error) {
      throw new Error(this.translateAdoptionError(error));
    }

    if (!data) {
      throw new Error("errors.generic");
    }

    return {
      id: data.id,
      animalId: data.animal_id,
      foundationId: data.foundation_id,
      adopterUserId: data.adopter_user_id,
      status: data.status,
    };
  }

  private async insertDetails(requestId: number, details: AdoptionRequestDetails): Promise<void> {
    const { error } = await supabaseClient.from("adoption_request_details").insert({
      request_id: requestId,
      adopter_display_name: details.adopterDisplayName,
      adopter_phone: details.adopterPhone,
      adopter_email: details.adopterEmail,
      city: details.city,
      neighborhood: details.neighborhood,
      housing_type: details.housingType,
      is_rent: details.isRent,
      allows_pets: details.allowsPets,
      household_people_count: details.householdPeopleCount,
      has_children: details.hasChildren,
      children_ages: details.childrenAges,
      has_other_pets: details.hasOtherPets,
      other_pets_description: details.otherPetsDescription,
      hours_alone_per_day: details.hoursAlonePerDay,
      travel_plan: details.travelPlan,
      experience_text: details.experienceText,
      motivation_text: details.motivationText,
      accepts_vet_costs: details.acceptsVetCosts,
      accepts_lifetime_commitment: details.acceptsLifetimeCommitment,
    });

    if (error) {
      throw new Error(this.translateAdoptionError(error));
    }
  }

  private async ensureAdopterProfile(adopterUserId: string): Promise<void> {
    // Primero verificar si el perfil ya existe
    const { data: existingProfile, error: selectError } = await supabaseClient
      .from("profiles")
      .select("id, role")
      .eq("id", adopterUserId)
      .single();

    // Si hay un error que no sea "no encontrado", lanzar error
    if (selectError && selectError.code !== "PGRST116") {
      throw new Error(this.translateAdoptionError(selectError));
    }

    // Si el perfil ya existe, no hacer nada (preservar el rol existente)
    if (existingProfile) {
      return;
    }

    // Si el perfil no existe, crearlo con rol "external"
    const { error: insertError } = await supabaseClient.from("profiles").insert({
      id: adopterUserId,
      role: "external",
    });

    if (insertError) {
      throw new Error(this.translateAdoptionError(insertError));
    }
  }

  private async uploadDocuments(params: {
    requestId: number;
    foundationId: string;
    documents: AdoptionRequestDocuments;
  }): Promise<void> {
    const { requestId, foundationId, documents } = params;

    const idDocumentPath = await this.privateFileStorage.uploadFile({
      foundationId,
      requestId,
      file: documents.idDocument,
      type: "adoption-request",
      docType: "id-document",
    });

    const homePhotoPaths = await Promise.all(
      documents.homePhotos.map((file, index) =>
        this.privateFileStorage.uploadFile({
          foundationId,
          requestId,
          file,
          type: "adoption-request",
          docType: `home-${index + 1}`,
        }),
      ),
    );

    const rows = [
      {
        request_id: requestId,
        doc_type: "id_document",
        file_url: idDocumentPath,
      },
      ...homePhotoPaths.map((path) => ({
        request_id: requestId,
        doc_type: "home_photos",
        file_url: path,
      })),
    ];

    const { error } = await supabaseClient.from("adoption_request_documents").insert(rows);

    if (error) {
      throw new Error(this.translateAdoptionError(error));
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

  private extractMessageId(notes: string | null): number | null {
    if (!notes) return null;
    const match = notes.match(/Response message ID:\s*(\d+)/i);
    if (!match) return null;
    const id = Number(match[1]);
    return Number.isNaN(id) ? null : id;
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

  private normalizeFoundation(
    foundation: AdoptionRequestFoundationRow | AdoptionRequestFoundationRow[] | null,
  ): AdoptionRequestFoundationRow | null {
    if (!foundation) return null;
    if (Array.isArray(foundation)) {
      return foundation[0] ?? null;
    }
    return foundation;
  }

  private normalizeSpecies(value: AdoptionRequestDetail["animal"]["species"] | null | undefined): "dog" | "cat" {
    if (value === "cat") {
      return "cat";
    }
    return "dog";
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

  private mapUserSummary(row: AdoptionRequestUserRow): GetUserAdoptionRequestsResult["requests"][number] {
    const animal = this.normalizeAnimal(row.animals);
    const foundation = this.normalizeFoundation(row.foundations);

    return {
      id: row.id,
      status: row.status,
      createdAt: row.created_at,
      animal: {
        id: animal?.id ?? 0,
        name: animal?.name ?? "",
        species: this.normalizeSpecies(animal?.species),
        coverImageUrl: animal?.cover_image_url ?? null,
      },
      foundation: {
        id: foundation?.id ?? "",
        name: foundation?.name ?? "",
      },
    };
  }

  private translateAdoptionError(error: { message?: string; code?: string }): string {
    const message = error.message?.toLowerCase?.() ?? "";
    const code = error.code?.toLowerCase?.() ?? "";

    if (code === "23505") {
      return "errors.duplicate";
    }

    if (code === "23503") {
      return "errors.notFound";
    }

    if (code === "42501") {
      return "errors.unauthorized";
    }

    if (code === "pgrst116" || message.includes("no rows") || message.includes("0 rows")) {
      return "errors.notFound";
    }

    if (
      message.includes("permission") ||
      message.includes("row level") ||
      message.includes("row-level") ||
      message.includes("rls")
    ) {
      return "errors.unauthorized";
    }

    if (message.includes("duplicate") || message.includes("unique")) {
      return "errors.duplicate";
    }

    if (message.includes("connection") || message.includes("network") || message.includes("failed to fetch")) {
      return "errors.connection";
    }

    if (message.includes("storage") || message.includes("bucket")) {
      return "errors.storageUnavailable";
    }

    return "errors.generic";
  }

  private async rollbackRequest(requestId: number): Promise<void> {
    try {
      await supabaseClient.from("adoption_requests").delete().eq("id", requestId);
    } catch {
      // Best-effort rollback. Ignore errors to preserve original failure.
    }
  }
}
