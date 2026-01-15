import type { AdoptionRequestDocument } from "@/domain/models/AdoptionRequestDocument";
import type {
  AnimalManagementSex,
  AnimalManagementSize,
  AnimalManagementSpecies,
} from "@/domain/models/AnimalManagement";
export type AdoptionRequestStatus =
  | "pending"
  | "in_review"
  | "info_requested"
  | "preapproved"
  | "approved"
  | "rejected"
  | "cancelled"
  | "completed";

export type AdoptionRequestPriority = "low" | "medium" | "high";

export type AdoptionHousingType = "house" | "apartment" | "other";
export type AdoptionRequestHousingType = AdoptionHousingType;

export interface AdoptionRequest {
  id: number;
  animalId: number;
  foundationId: string;
  adopterUserId: string;
  status: AdoptionRequestStatus;
}

export interface AdoptionRequestDetails {
  adopterDisplayName: string;
  adopterEmail: string;
  adopterPhone: string;
  city: string;
  neighborhood: string;
  housingType: AdoptionHousingType | null;
  isRent: boolean | null;
  allowsPets: boolean | null;
  householdPeopleCount: number | null;
  hasChildren: boolean;
  childrenAges: string | null;
  hasOtherPets: boolean;
  otherPetsDescription: string | null;
  hoursAlonePerDay: number | null;
  travelPlan: string | null;
  experienceText: string | null;
  motivationText: string | null;
  acceptsVetCosts: boolean;
  acceptsLifetimeCommitment: boolean;
}

export interface AdoptionRequestDocuments {
  idDocument: File;
  homePhotos: File[];
}

export interface AdoptionRequestSummary {
  id: number;
  animal: {
    id: number;
    name: string;
    coverImageUrl: string | null;
  };
  adopter: {
    displayName: string;
  };
  priority: AdoptionRequestPriority;
  status: AdoptionRequestStatus;
  createdAt: string;
}

export interface AdoptionRequestAdopterProfile {
  displayName: string;
  phone: string | null;
  email: string | null;
  city: string | null;
  neighborhood: string | null;
  housingType: AdoptionRequestHousingType | null;
  isRent: boolean | null;
  allowsPets: boolean | null;
  householdPeopleCount: number | null;
  hasChildren: boolean | null;
  childrenAges: string | null;
  hasOtherPets: boolean | null;
  otherPetsDescription: string | null;
  hoursAlonePerDay: number | null;
  travelPlan: string | null;
  experienceText: string | null;
  motivationText: string | null;
  acceptsVetCosts: boolean | null;
  acceptsLifetimeCommitment: boolean | null;
}

export interface AdoptionRequestAnimalSnapshot {
  id: number;
  name: string;
  species: AnimalManagementSpecies;
  breed: string | null;
  sex: AnimalManagementSex;
  ageMonths: number | null;
  size: AnimalManagementSize;
  coverImageUrl: string | null;
}

export interface AdoptionRequestDetail {
  id: number;
  status: AdoptionRequestStatus;
  priority: AdoptionRequestPriority;
  rejectionReason: string | null;
  createdAt: string;
  adopterProfile: AdoptionRequestAdopterProfile;
  animal: AdoptionRequestAnimalSnapshot;
  documents: AdoptionRequestDocument[];
}
