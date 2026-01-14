import type { HomeAnimals } from "../models/HomeAnimals";
import type { AnimalManagement, AnimalManagementSpecies, AnimalManagementStatus } from "@/domain/models/AnimalManagement";

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

export interface IAnimalRepository {
  getHomeAnimals(): Promise<HomeAnimals>;
  getAnimals(params: GetAnimalsParams): Promise<GetAnimalsResult>;
  getAnimalsCount(foundationId: string): Promise<number>;
  getRecentAnimals(foundationId: string, limit: number): Promise<AnimalManagement[]>;
  getAnimalsInTreatment(foundationId: string): Promise<AnimalManagement[]>;
}
