export type AdoptionRequestDocumentType = "id_document" | "home_photos" | "vaccination_card" | "other";

export interface AdoptionRequestDocument {
  id: number;
  requestId: number;
  docType: AdoptionRequestDocumentType;
  fileUrl: string;
  notes: string | null;
  createdAt: string;
}
