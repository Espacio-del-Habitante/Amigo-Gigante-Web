import type { AdoptSex, AdoptSizeFilter, AdoptSpeciesFilter } from "@/domain/models/AdoptCatalogItem";

export type AdoptStatus = "available" | "adopted" | "pending" | "in_treatment" | "inactive";

export interface AdoptDetailPhoto {
  url: string;
  sortOrder: number;
}

export interface AdoptDetail {
  id: number;
  name: string;
  species: AdoptSpeciesFilter;
  breed: string;
  sex: AdoptSex;
  ageMonths: number | null;
  size: AdoptSizeFilter | "unknown";
  status: AdoptStatus;
  description: string;
  coverImageUrl: string | null;
  photos: AdoptDetailPhoto[];
}
