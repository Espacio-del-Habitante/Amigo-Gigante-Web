import type { HomeAnimals } from "../models/HomeAnimals";

export interface IAnimalRepository {
  getHomeAnimals(): Promise<HomeAnimals>;
}
