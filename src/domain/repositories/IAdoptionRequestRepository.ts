import type {
  AdoptionRequest,
  AdoptionRequestDetails,
  AdoptionRequestDocuments,
} from "@/domain/models/AdoptionRequest";

export interface CreateAdoptionRequestParams {
  animalId: number;
  foundationId: string;
  adopterUserId: string;
  details: AdoptionRequestDetails;
  documents: AdoptionRequestDocuments;
}

export interface IAdoptionRequestRepository {
  createAdoptionRequest(params: CreateAdoptionRequestParams): Promise<AdoptionRequest>;
}
