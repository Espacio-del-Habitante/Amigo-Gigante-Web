import { ContainerModule, ContainerModuleLoadOptions } from "inversify";

import type { IAnimalRepository } from "@/domain/repositories/IAnimalRepository";
import type { IAuthRepository } from "@/domain/repositories/IAuthRepository";
import type { IDebugRepository } from "@/domain/repositories/IDebugRepository";
import type { IFoundationRepository } from "@/domain/repositories/IFoundationRepository";
import type { IFoundationMembershipRepository } from "@/domain/repositories/IFoundationMembershipRepository";
import type { IFoundationProfileRepository } from "@/domain/repositories/IFoundationProfileRepository";
import { AnimalRepository } from "@/infrastructure/repositories/AnimalRepository";
import { AuthRepository } from "@/infrastructure/repositories/AuthRepository";
import { DebugRepository } from "@/infrastructure/repositories/DebugRepository";
import { FoundationMembershipRepository } from "@/infrastructure/repositories/FoundationMembershipRepository";
import { FoundationRepository } from "@/infrastructure/repositories/FoundationRepository";
import { FoundationProfileRepository } from "@/infrastructure/repositories/FoundationProfileRepository";
import { REPOSITORY_TYPES } from "./repositories.types";

const repositoriesModule = new ContainerModule(
  ({ bind }: ContainerModuleLoadOptions) => {
    bind<IDebugRepository>(REPOSITORY_TYPES.DebugRepository)
      .to(DebugRepository)
      .inSingletonScope();

    bind<IAnimalRepository>(REPOSITORY_TYPES.AnimalRepository)
      .to(AnimalRepository)
      .inSingletonScope();

    bind<IAuthRepository>(REPOSITORY_TYPES.AuthRepository)
      .to(AuthRepository)
      .inSingletonScope();

    bind<IFoundationRepository>(REPOSITORY_TYPES.FoundationRepository)
      .to(FoundationRepository)
      .inSingletonScope();

    bind<IFoundationProfileRepository>(REPOSITORY_TYPES.FoundationProfileRepository)
      .to(FoundationProfileRepository)
      .inSingletonScope();

    bind<IFoundationMembershipRepository>(REPOSITORY_TYPES.FoundationMembershipRepository)
      .to(FoundationMembershipRepository)
      .inSingletonScope();
  },
);

export { repositoriesModule };
