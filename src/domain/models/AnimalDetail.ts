import type { AnimalManagementSex, AnimalManagementSize, AnimalManagementSpecies, AnimalManagementStatus } from "@/domain/models/AnimalManagement";

export interface AnimalPhoto {
  url: string;
  sortOrder: number;
}

export interface AnimalDetail {
  id: number;
  name: string;
  species: AnimalManagementSpecies;
  breed: string;
  sex: AnimalManagementSex;
  ageMonths: number | null;
  size: AnimalManagementSize;
  status: AnimalManagementStatus;
  description: string;
  coverImageUrl: string | null;
  isPublished: boolean;
  photos: AnimalPhoto[];
}
