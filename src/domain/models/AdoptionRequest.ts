export type AdoptionRequestStatus =
  | "pending"
  | "in_review"
  | "info_requested"
  | "preapproved"
  | "approved"
  | "rejected"
  | "cancelled"
  | "completed";

export type AdoptionHousingType = "house" | "apartment" | "other";

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
  hasChildren: boolean | null;
  childrenAges: string | null;
  hasOtherPets: boolean | null;
  otherPetsDescription: string | null;
  hoursAlonePerDay: number | null;
  travelPlan: string | null;
  experienceText: string | null;
  motivationText: string | null;
  acceptsVetCosts: boolean | null;
  acceptsLifetimeCommitment: boolean;
}

export interface AdoptionRequestDocuments {
  idDocument: File;
  homePhotos: File[];
}
