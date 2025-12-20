import { ContainerModule, ContainerModuleLoadOptions } from "inversify";

import type { IAnimalRepository } from "@/domain/repositories/IAnimalRepository";
import type { IDebugRepository } from "@/domain/repositories/IDebugRepository";
import { DebugUseCase } from "@/domain/usecases/debug/DebugUseCase";
import { GetHomeAnimalsUseCase } from "@/domain/usecases/animals/GetHomeAnimalsUseCase";
import { REPOSITORY_TYPES } from "../repositories/repositories.types";
import { USE_CASE_TYPES } from "./usecases.types";

const useCasesModule = new ContainerModule(
  ({ bind }: ContainerModuleLoadOptions) => {
    bind<DebugUseCase>(USE_CASE_TYPES.DebugUseCase)
      .toDynamicValue((context) => {
        const debugRepository = context.get<IDebugRepository>(
          REPOSITORY_TYPES.DebugRepository,
        );

        return new DebugUseCase(debugRepository);
      })
      .inSingletonScope();

    bind<GetHomeAnimalsUseCase>(USE_CASE_TYPES.GetHomeAnimalsUseCase)
      .toDynamicValue((context) => {
        const animalRepository = context.get<IAnimalRepository>(
          REPOSITORY_TYPES.AnimalRepository,
        );

        return new GetHomeAnimalsUseCase(animalRepository);
      })
      .inSingletonScope();
  },
);

const useCaseModules = [useCasesModule];

export { useCaseModules, useCasesModule };
