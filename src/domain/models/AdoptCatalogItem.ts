export type AdoptSpeciesFilter = "dog" | "cat" | "other";

export type AdoptSizeFilter = "small" | "medium" | "large";

export type AdoptSex = "male" | "female" | "unknown";

export type AdoptAgeFilter = "puppy" | "young" | "adult" | "senior";

export interface AdoptCatalogItem {
  id: number;
  name: string;
  species: AdoptSpeciesFilter;
  breed: string;
  sex: AdoptSex;
  ageMonths: number | null;
  size: AdoptSizeFilter | "unknown";
  description: string;
  coverImageUrl: string | null;
  createdAt: string;
  isUrgent: boolean;
}

