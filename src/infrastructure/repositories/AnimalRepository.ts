import type { IAnimalRepository } from "@/domain/repositories/IAnimalRepository";
import { animalsMock } from "@/infrastructure/mocks/animals.mock";

export class AnimalRepository implements IAnimalRepository {
  async getHomeAnimals() {
    return animalsMock;
  }
}
