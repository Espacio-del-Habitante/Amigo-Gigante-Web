import type { HomeAnimals } from "../models/HomeAnimals";
import type {
  AnimalManagement,
  AnimalManagementSex,
  AnimalManagementSize,
  AnimalManagementSpecies,
  AnimalManagementStatus,
} from "@/domain/models/AnimalManagement";

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

export interface IAnimalRepository {
  getHomeAnimals(): Promise<HomeAnimals>;
  getAnimals(params: GetAnimalsParams): Promise<GetAnimalsResult>;
  createAnimal(params: CreateAnimalParams): Promise<AnimalManagement>;
  createAnimalPhotos(params: CreateAnimalPhotoParams[]): Promise<void>;
}
