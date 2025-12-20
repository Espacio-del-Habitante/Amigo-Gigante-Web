import { ContainerModule, ContainerModuleLoadOptions } from "inversify";

import type { IAnimalRepository } from "@/domain/repositories/IAnimalRepository";
import type { IDebugRepository } from "@/domain/repositories/IDebugRepository";
import { AnimalRepository } from "@/infrastructure/repositories/AnimalRepository";
import { DebugRepository } from "@/infrastructure/repositories/DebugRepository";
import { REPOSITORY_TYPES } from "./repositories.types";

const repositoriesModule = new ContainerModule(
  ({ bind }: ContainerModuleLoadOptions) => {
    bind<IDebugRepository>(REPOSITORY_TYPES.DebugRepository)
      .to(DebugRepository)
      .inSingletonScope();

    bind<IAnimalRepository>(REPOSITORY_TYPES.AnimalRepository)
      .to(AnimalRepository)
      .inSingletonScope();
  },
);

export { repositoriesModule };
