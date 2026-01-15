import type { HomeAnimals } from "../models/HomeAnimals";
import type { AnimalDetail } from "@/domain/models/AnimalDetail";
import type {
  AnimalManagement,
  AnimalManagementSex,
  AnimalManagementSize,
  AnimalManagementSpecies,
  AnimalManagementStatus,
} from "@/domain/models/AnimalManagement";
import type {
  AdoptAgeFilter,
  AdoptCatalogItem,
  AdoptSizeFilter,
  AdoptSpeciesFilter,
} from "@/domain/models/AdoptCatalogItem";
import type { AdoptDetail } from "@/domain/models/AdoptDetail";

export type AnimalsSortOption = "newest" | "oldest" | "nameAsc" | "nameDesc";

export interface GetAnimalsFilters {
  status?: AnimalManagementStatus;
  species?: AnimalManagementSpecies;
  search?: string;
  sort?: AnimalsSortOption;
}

export interface GetAnimalsPagination {
  page: number;
  pageSize: number;
}

export interface GetAnimalsParams {
  foundationId: string;
  filters?: GetAnimalsFilters;
  pagination: GetAnimalsPagination;
}

export interface GetAnimalsResult {
  animals: AnimalManagement[];
  total: number;
}

export interface CreateAnimalParams {
  foundationId: string;
  name: string;
  species: AnimalManagementSpecies;
  breed?: string | null;
  sex: AnimalManagementSex;
  ageMonths: number;
  size: AnimalManagementSize;
  status: AnimalManagementStatus;
  description: string;
  coverImageUrl?: string | null;
  isPublished: boolean;
}

export interface CreateAnimalPhotoParams {
  animalId: number;
  url: string;
  sortOrder: number;
}

export interface GetAnimalByIdParams {
  animalId: number;
  foundationId: string;
}

export interface UpdateAnimalParams {
  animalId: number;
  foundationId: string;
  name: string;
  species: AnimalManagementSpecies;
  breed?: string | null;
  sex: AnimalManagementSex;
  ageMonths: number;
  size: AnimalManagementSize;
  status: AnimalManagementStatus;
  description: string;
  coverImageUrl?: string | null;
  isPublished: boolean;
}

export interface ReplaceAnimalPhotosParams {
  animalId: number;
  photoUrls: string[];
}

export type AdoptSortOption = "newest" | "oldest" | "urgent";

export interface GetAdoptCatalogFilters {
  species?: AdoptSpeciesFilter;
  size?: AdoptSizeFilter;
  age?: AdoptAgeFilter;
  urgentOnly?: boolean;
  search?: string;
  sort?: AdoptSortOption;
}

export interface GetAdoptCatalogPagination {
  page: number;
  pageSize: number;
}

export interface GetAdoptCatalogParams {
  filters?: GetAdoptCatalogFilters;
  pagination: GetAdoptCatalogPagination;
}

export interface GetAdoptCatalogResult {
  items: AdoptCatalogItem[];
  total: number;
}

export interface GetAdoptDetailParams {
  id: number;
}

export interface GetRelatedAnimalsParams {
  id: number;
  limit?: number;
}

export interface IAnimalRepository {
  getHomeAnimals(): Promise<HomeAnimals>;
  getAnimals(params: GetAnimalsParams): Promise<GetAnimalsResult>;
  getAnimalsCount(foundationId: string): Promise<number>;
  getRecentAnimals(foundationId: string, limit: number): Promise<AnimalManagement[]>;
  getAnimalsInTreatment(foundationId: string): Promise<AnimalManagement[]>;
  createAnimal(params: CreateAnimalParams): Promise<AnimalManagement>;
  createAnimalPhotos(params: CreateAnimalPhotoParams[]): Promise<void>;
  getAnimalById(params: GetAnimalByIdParams): Promise<AnimalDetail>;
  updateAnimal(params: UpdateAnimalParams): Promise<void>;
  replaceAnimalPhotos(params: ReplaceAnimalPhotosParams): Promise<void>;
  getAdoptCatalog(params: GetAdoptCatalogParams): Promise<GetAdoptCatalogResult>;
  getAdoptDetail(params: GetAdoptDetailParams): Promise<AdoptDetail>;
  getRelatedAnimals(params: GetRelatedAnimalsParams): Promise<AdoptCatalogItem[]>;
}
