import { ContainerModule, ContainerModuleLoadOptions } from "inversify";

import type { IAnimalRepository } from "@/domain/repositories/IAnimalRepository";
import type { IAuthRepository } from "@/domain/repositories/IAuthRepository";
import type { IDebugRepository } from "@/domain/repositories/IDebugRepository";
import type { IFoundationRepository } from "@/domain/repositories/IFoundationRepository";
import type { IFoundationProfileRepository } from "@/domain/repositories/IFoundationProfileRepository";
import { DebugUseCase } from "@/domain/usecases/debug/DebugUseCase";
import { GetHomeAnimalsUseCase } from "@/domain/usecases/animals/GetHomeAnimalsUseCase";
import { GetSessionUseCase } from "@/domain/usecases/auth/GetSessionUseCase";
import { LoginUseCase } from "@/domain/usecases/auth/LoginUseCase";
import { RegisterFoundationUseCase } from "@/domain/usecases/auth/RegisterFoundationUseCase";
import { GetFoundationProfileUseCase } from "@/domain/usecases/foundation/GetFoundationProfileUseCase";
import { UpdateFoundationProfileUseCase } from "@/domain/usecases/foundation/UpdateFoundationProfileUseCase";
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

    bind<RegisterFoundationUseCase>(USE_CASE_TYPES.RegisterFoundationUseCase)
      .toDynamicValue((context) => {
        const authRepository = context.get<IAuthRepository>(REPOSITORY_TYPES.AuthRepository);
        const foundationRepository = context.get<IFoundationRepository>(
          REPOSITORY_TYPES.FoundationRepository,
        );

        return new RegisterFoundationUseCase(authRepository, foundationRepository);
      })
      .inSingletonScope();

    bind<LoginUseCase>(USE_CASE_TYPES.LoginUseCase)
      .toDynamicValue((context) => {
        const authRepository = context.get<IAuthRepository>(REPOSITORY_TYPES.AuthRepository);

        return new LoginUseCase(authRepository);
      })
      .inSingletonScope();

    bind<GetSessionUseCase>(USE_CASE_TYPES.GetSessionUseCase)
      .toDynamicValue((context) => {
        const authRepository = context.get<IAuthRepository>(REPOSITORY_TYPES.AuthRepository);

        return new GetSessionUseCase(authRepository);
      })
      .inSingletonScope();

    bind<GetFoundationProfileUseCase>(USE_CASE_TYPES.GetFoundationProfileUseCase)
      .toDynamicValue((context) => {
        const foundationProfileRepository = context.get<IFoundationProfileRepository>(
          REPOSITORY_TYPES.FoundationProfileRepository,
        );

        return new GetFoundationProfileUseCase(foundationProfileRepository);
      })
      .inSingletonScope();

    bind<UpdateFoundationProfileUseCase>(USE_CASE_TYPES.UpdateFoundationProfileUseCase)
      .toDynamicValue((context) => {
        const foundationProfileRepository = context.get<IFoundationProfileRepository>(
          REPOSITORY_TYPES.FoundationProfileRepository,
        );

        return new UpdateFoundationProfileUseCase(foundationProfileRepository);
      })
      .inSingletonScope();
  },
);

const useCaseModules = [useCasesModule];

export { useCaseModules, useCasesModule };
