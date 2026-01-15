import { ContainerModule, ContainerModuleLoadOptions } from "inversify";

import type { IAnimalRepository } from "@/domain/repositories/IAnimalRepository";
import type { IAuthRepository } from "@/domain/repositories/IAuthRepository";
import type { IDebugRepository } from "@/domain/repositories/IDebugRepository";
import type { IEventRepository } from "@/domain/repositories/IEventRepository";
import type { IFoundationRepository } from "@/domain/repositories/IFoundationRepository";
import type { IFoundationMembershipRepository } from "@/domain/repositories/IFoundationMembershipRepository";
import type { IFoundationProfileRepository } from "@/domain/repositories/IFoundationProfileRepository";
import type { IProductRepository } from "@/domain/repositories/IProductRepository";
import { DebugUseCase } from "@/domain/usecases/debug/DebugUseCase";
import { GetShopCatalogUseCase } from "@/domain/usecases/shop/GetShopCatalogUseCase";
import { CreateAnimalUseCase } from "@/domain/usecases/animals/CreateAnimalUseCase";
import { DeleteAnimalUseCase } from "@/domain/usecases/animals/DeleteAnimalUseCase";
import { GetAnimalsUseCase } from "@/domain/usecases/animals/GetAnimalsUseCase";
import { GetHomeAnimalsUseCase } from "@/domain/usecases/animals/GetHomeAnimalsUseCase";
import { GetAdoptCatalogUseCase } from "@/domain/usecases/adopt/GetAdoptCatalogUseCase";
import { GetSessionUseCase } from "@/domain/usecases/auth/GetSessionUseCase";
import { LoginUseCase } from "@/domain/usecases/auth/LoginUseCase";
import { RegisterFoundationUseCase } from "@/domain/usecases/auth/RegisterFoundationUseCase";
import { GetDashboardDataUseCase } from "@/domain/usecases/dashboard/GetDashboardDataUseCase";
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

    bind<GetAdoptCatalogUseCase>(USE_CASE_TYPES.GetAdoptCatalogUseCase)
      .toDynamicValue((context) => {
        const animalRepository = context.get<IAnimalRepository>(REPOSITORY_TYPES.AnimalRepository);

        return new GetAdoptCatalogUseCase(animalRepository);
      })
      .inSingletonScope();

    bind<GetAnimalsUseCase>(USE_CASE_TYPES.GetAnimalsUseCase)
      .toDynamicValue((context) => {
        const animalRepository = context.get<IAnimalRepository>(REPOSITORY_TYPES.AnimalRepository);
        const authRepository = context.get<IAuthRepository>(REPOSITORY_TYPES.AuthRepository);
        const foundationMembershipRepository = context.get<IFoundationMembershipRepository>(
          REPOSITORY_TYPES.FoundationMembershipRepository,
        );

        return new GetAnimalsUseCase(animalRepository, authRepository, foundationMembershipRepository);
      })
      .inSingletonScope();

    bind<CreateAnimalUseCase>(USE_CASE_TYPES.CreateAnimalUseCase)
      .toDynamicValue((context) => {
        const animalRepository = context.get<IAnimalRepository>(REPOSITORY_TYPES.AnimalRepository);
        const authRepository = context.get<IAuthRepository>(REPOSITORY_TYPES.AuthRepository);
        const foundationMembershipRepository = context.get<IFoundationMembershipRepository>(
          REPOSITORY_TYPES.FoundationMembershipRepository,
        );

        return new CreateAnimalUseCase(animalRepository, authRepository, foundationMembershipRepository);
      })
      .inSingletonScope();

    bind<DeleteAnimalUseCase>(USE_CASE_TYPES.DeleteAnimalUseCase)
      .toDynamicValue((context) => {
        const animalRepository = context.get<IAnimalRepository>(REPOSITORY_TYPES.AnimalRepository);
        const authRepository = context.get<IAuthRepository>(REPOSITORY_TYPES.AuthRepository);
        const foundationMembershipRepository = context.get<IFoundationMembershipRepository>(
          REPOSITORY_TYPES.FoundationMembershipRepository,
        );

        return new DeleteAnimalUseCase(animalRepository, authRepository, foundationMembershipRepository);
      })
      .inSingletonScope();

    bind<GetDashboardDataUseCase>(USE_CASE_TYPES.GetDashboardDataUseCase)
      .toDynamicValue((context) => {
        const animalRepository = context.get<IAnimalRepository>(REPOSITORY_TYPES.AnimalRepository);
        const eventRepository = context.get<IEventRepository>(REPOSITORY_TYPES.EventRepository);
        const productRepository = context.get<IProductRepository>(REPOSITORY_TYPES.ProductRepository);
        const authRepository = context.get<IAuthRepository>(REPOSITORY_TYPES.AuthRepository);
        const foundationRepository = context.get<IFoundationRepository>(REPOSITORY_TYPES.FoundationRepository);
        const foundationMembershipRepository = context.get<IFoundationMembershipRepository>(
          REPOSITORY_TYPES.FoundationMembershipRepository,
        );

        return new GetDashboardDataUseCase(
          animalRepository,
          eventRepository,
          productRepository,
          authRepository,
          foundationRepository,
          foundationMembershipRepository,
        );
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

    bind<GetShopCatalogUseCase>(USE_CASE_TYPES.GetShopCatalogUseCase)
      .toDynamicValue((context) => {
        const productRepository = context.get<IProductRepository>(REPOSITORY_TYPES.ProductRepository);
        const foundationRepository = context.get<IFoundationRepository>(REPOSITORY_TYPES.FoundationRepository);

        return new GetShopCatalogUseCase(productRepository, foundationRepository);
      })
      .inSingletonScope();
  },
);

const useCaseModules = [useCasesModule];

export { useCaseModules, useCasesModule };
