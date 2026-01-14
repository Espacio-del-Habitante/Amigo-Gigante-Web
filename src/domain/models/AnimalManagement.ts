export type AnimalManagementSpecies = "dog" | "cat" | "bird" | "other";

export type AnimalManagementStatus = "available" | "adopted" | "pending" | "in_treatment" | "inactive";

export type AnimalManagementSex = "male" | "female" | "unknown";

export type AnimalManagementSize = "small" | "medium" | "large" | "unknown";

export interface AnimalManagement {
  id: number;
  name: string;
  species: AnimalManagementSpecies;
  breed: string;
  sex: AnimalManagementSex;
  ageMonths: number | null;
  size: AnimalManagementSize;
  status: AnimalManagementStatus;
  coverImageUrl: string | null;
  createdAt: string;
}

