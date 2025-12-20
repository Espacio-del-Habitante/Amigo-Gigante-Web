import type { IAnimalRepository } from "@/domain/repositories/IAnimalRepository";

export class GetHomeAnimalsUseCase {
  constructor(private readonly animalRepository: IAnimalRepository) {}

  async execute() {
    return this.animalRepository.getHomeAnimals();
  }
}
