import { ContainerModule, ContainerModuleLoadOptions } from "inversify";

import type { IDebugRepository } from "@/domain/repositories/IDebugRepository";
import { DebugRepository } from "@/infrastructure/repositories/DebugRepository";
import { REPOSITORY_TYPES } from "./repositories.types";

const repositoriesModule = new ContainerModule(
  ({ bind }: ContainerModuleLoadOptions) => {
    bind<IDebugRepository>(REPOSITORY_TYPES.DebugRepository)
      .to(DebugRepository)
      .inSingletonScope();
  },
);

export { repositoriesModule };
