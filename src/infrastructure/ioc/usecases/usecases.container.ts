import { ContainerModule, ContainerModuleLoadOptions } from "inversify";

import type { IDebugRepository } from "@/domain/repositories/IDebugRepository";
import { DebugUseCase } from "@/domain/usecases/debug/DebugUseCase";
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
  },
);

const useCaseModules = [useCasesModule];

export { useCaseModules, useCasesModule };
