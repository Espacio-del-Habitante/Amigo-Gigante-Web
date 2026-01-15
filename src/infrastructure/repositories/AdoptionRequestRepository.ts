import type { StorageError } from "@supabase/supabase-js";

import type {
  AdoptionRequest,
  AdoptionRequestDocuments,
  AdoptionRequestDetails,
} from "@/domain/models/AdoptionRequest";
import type { CreateAdoptionRequestParams, IAdoptionRequestRepository } from "@/domain/repositories/IAdoptionRequestRepository";
import { supabaseClient } from "@/infrastructure/config/supabase";

const DOCUMENTS_BUCKET = "adoption_request_documents";

export class AdoptionRequestRepository implements IAdoptionRequestRepository {
  async createAdoptionRequest(params: CreateAdoptionRequestParams): Promise<AdoptionRequest> {
    const { animalId, foundationId, adopterUserId, details, documents } = params;

    if (!documents?.idDocument || documents.homePhotos.length === 0) {
      throw new Error("errors.documentsRequired");
    }

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

  private async uploadDocuments(params: {
    requestId: number;
    foundationId: string;
    documents: AdoptionRequestDocuments;
  }): Promise<void> {
    const { requestId, foundationId, documents } = params;

    const idDocumentUrl = await this.uploadFile({
      foundationId,
      requestId,
      file: documents.idDocument,
      label: "id-document",
    });

    const homePhotoUrls = await Promise.all(
      documents.homePhotos.map((file, index) =>
        this.uploadFile({
          foundationId,
          requestId,
          file,
          label: `home-${index + 1}`,
        }),
      ),
    );

    const rows = [
      {
        request_id: requestId,
        doc_type: "id_document",
        file_url: idDocumentUrl,
      },
      ...homePhotoUrls.map((url) => ({
        request_id: requestId,
        doc_type: "home_photos",
        file_url: url,
      })),
    ];

    const { error } = await supabaseClient.from("adoption_request_documents").insert(rows);

    if (error) {
      throw new Error(this.translateAdoptionError(error));
    }
  }

  private async uploadFile(params: {
    foundationId: string;
    requestId: number;
    file: File;
    label: string;
  }): Promise<string> {
    const { foundationId, requestId, file, label } = params;
    const sanitizedName = this.sanitizeFileName(file.name);
    const filePath = `${foundationId}/${requestId}/${label}-${Date.now()}-${sanitizedName}`;

    const { data, error } = await supabaseClient.storage.from(DOCUMENTS_BUCKET).upload(filePath, file, {
      upsert: false,
    });

    if (error) {
      throw new Error(this.translateStorageError(error));
    }

    const publicUrl = supabaseClient.storage.from(DOCUMENTS_BUCKET).getPublicUrl(data?.path ?? "").data.publicUrl;

    if (!publicUrl) {
      throw new Error("errors.storageUnavailable");
    }

    return publicUrl;
  }

  private sanitizeFileName(fileName: string): string {
    return fileName.replace(/[^a-z0-9.\-_]/gi, "-").toLowerCase();
  }

  private translateAdoptionError(error: { message?: string; code?: string }): string {
    const message = error.message?.toLowerCase?.() ?? "";
    const code = error.code?.toLowerCase?.() ?? "";

    if (code === "pgrst116" || message.includes("no rows") || message.includes("0 rows")) {
      return "errors.notFound";
    }

    if (message.includes("permission") || message.includes("row level")) {
      return "errors.unauthorized";
    }

    if (message.includes("duplicate") || message.includes("unique")) {
      return "errors.duplicate";
    }

    if (message.includes("connection") || message.includes("network")) {
      return "errors.connection";
    }

    if (message.includes("storage") || message.includes("bucket")) {
      return "errors.storageUnavailable";
    }

    return "errors.generic";
  }

  private translateStorageError(error: StorageError | Error): string {
    const message = error.message?.toLowerCase?.() ?? "";

    if (message.includes("bucket") || message.includes("not found") || message.includes("storage")) {
      return "errors.storageUnavailable";
    }

    if (message.includes("permission")) {
      return "errors.unauthorized";
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
