import type { AdoptSex, AdoptSizeFilter, AdoptSpeciesFilter } from "./AdoptCatalogItem";
import type { AnimalManagementStatus } from "./AnimalManagement";

export interface AdoptPhoto {
  url: string;
  sortOrder: number;
}

export interface AdoptDetail {
  id: number;
  foundationId: string;
  name: string;
  species: AdoptSpeciesFilter;
  breed: string;
  sex: AdoptSex;
  ageMonths: number | null;
  size: AdoptSizeFilter | "unknown";
  status: AnimalManagementStatus;
  description: string;
  coverImageUrl: string | null;
  photos: AdoptPhoto[];
}
