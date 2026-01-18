import { ContainerModule, ContainerModuleLoadOptions } from "inversify";

import type { IAdoptionRequestRepository } from "@/domain/repositories/IAdoptionRequestRepository";
import type { IAnimalRepository } from "@/domain/repositories/IAnimalRepository";
import type { IAuthRepository } from "@/domain/repositories/IAuthRepository";
import type { ICartRepository } from "@/domain/repositories/ICartRepository";
import type { IDebugRepository } from "@/domain/repositories/IDebugRepository";
import type { IEventRepository } from "@/domain/repositories/IEventRepository";
import type { IFoundationRepository } from "@/domain/repositories/IFoundationRepository";
import type { IFoundationMembershipRepository } from "@/domain/repositories/IFoundationMembershipRepository";
import type { IFoundationProfileRepository } from "@/domain/repositories/IFoundationProfileRepository";
import type { IProductRepository } from "@/domain/repositories/IProductRepository";
import type { INotificationRepository } from "@/domain/repositories/INotificationRepository";

import { AnimalRepository } from "@/infrastructure/repositories/AnimalRepository";

import { AuthRepository } from "@/infrastructure/repositories/AuthRepository";
import { AdoptionRequestRepository } from "@/infrastructure/repositories/AdoptionRequestRepository";
import { CartRepository } from "@/infrastructure/repositories/CartRepository";
import { DebugRepository } from "@/infrastructure/repositories/DebugRepository";
import { EventRepository } from "@/infrastructure/repositories/EventRepository";
import { FoundationMembershipRepository } from "@/infrastructure/repositories/FoundationMembershipRepository";
import { FoundationRepository } from "@/infrastructure/repositories/FoundationRepository";
import { FoundationProfileRepository } from "@/infrastructure/repositories/FoundationProfileRepository";
import { ProductRepository } from "@/infrastructure/repositories/ProductRepository";
import { NotificationRepository } from "@/infrastructure/repositories/NotificationRepository";
import { REPOSITORY_TYPES } from "./repositories.types";

const repositoriesModule = new ContainerModule(
  ({ bind }: ContainerModuleLoadOptions) => {
    bind<IDebugRepository>(REPOSITORY_TYPES.DebugRepository)
      .to(DebugRepository)
      .inSingletonScope();

    bind<IAnimalRepository>(REPOSITORY_TYPES.AnimalRepository)
      .to(AnimalRepository)
      .inSingletonScope();

    bind<IEventRepository>(REPOSITORY_TYPES.EventRepository)
      .to(EventRepository)
      .inSingletonScope();

    bind<IProductRepository>(REPOSITORY_TYPES.ProductRepository)
      .to(ProductRepository)
      .inSingletonScope();

    bind<IAdoptionRequestRepository>(REPOSITORY_TYPES.AdoptionRequestRepository)
      .to(AdoptionRequestRepository)
      .inSingletonScope();

    bind<ICartRepository>(REPOSITORY_TYPES.CartRepository)
      .to(CartRepository)
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

    bind<INotificationRepository>(REPOSITORY_TYPES.NotificationRepository)
      .to(NotificationRepository)
      .inSingletonScope();
  },
);

export { repositoriesModule };
