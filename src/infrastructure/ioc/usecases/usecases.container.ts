import { ContainerModule, ContainerModuleLoadOptions } from "inversify";

import type { IAnimalRepository } from "@/domain/repositories/IAnimalRepository";
import type { IAuthRepository } from "@/domain/repositories/IAuthRepository";
import type { ICartRepository } from "@/domain/repositories/ICartRepository";
import type { IDebugRepository } from "@/domain/repositories/IDebugRepository";
import type { IEventRepository } from "@/domain/repositories/IEventRepository";
import type { IFoundationRepository } from "@/domain/repositories/IFoundationRepository";
import type { IFoundationMembershipRepository } from "@/domain/repositories/IFoundationMembershipRepository";
import type { IFoundationProfileRepository } from "@/domain/repositories/IFoundationProfileRepository";
import type { IProductRepository } from "@/domain/repositories/IProductRepository";
import type { IAdoptionRequestRepository } from "@/domain/repositories/IAdoptionRequestRepository";
import type { IPublicImageStorage } from "@/domain/repositories/IPublicImageStorage";
import type { IUserProfileRepository } from "@/domain/repositories/IUserProfileRepository";
import { DebugUseCase } from "@/domain/usecases/debug/DebugUseCase";
import { GetShopCatalogUseCase } from "@/domain/usecases/shop/GetShopCatalogUseCase";
import { GetProductDetailUseCase } from "@/domain/usecases/shop/GetProductDetailUseCase";
import { GetRelatedProductsUseCase } from "@/domain/usecases/shop/GetRelatedProductsUseCase";
import { CreateAnimalUseCase } from "@/domain/usecases/animals/CreateAnimalUseCase";
import { DeletePublicImageUseCase } from "@/domain/usecases/storage/DeletePublicImageUseCase";
import { UploadPublicImageUseCase } from "@/domain/usecases/storage/UploadPublicImageUseCase";
import { DeleteAnimalUseCase } from "@/domain/usecases/animals/DeleteAnimalUseCase";
import { GetAnimalByIdUseCase } from "@/domain/usecases/animals/GetAnimalByIdUseCase";
import { GetAnimalsUseCase } from "@/domain/usecases/animals/GetAnimalsUseCase";
import { GetHomeAnimalsUseCase } from "@/domain/usecases/animals/GetHomeAnimalsUseCase";
import { GetHomeProductsUseCase } from "@/domain/usecases/home/GetHomeProductsUseCase";
import { UpdateAnimalUseCase } from "@/domain/usecases/animals/UpdateAnimalUseCase";
import { GetAdoptCatalogUseCase } from "@/domain/usecases/adopt/GetAdoptCatalogUseCase";
import { GetAdoptDetailUseCase } from "@/domain/usecases/adopt/GetAdoptDetailUseCase";
import { CreateAdoptionRequestUseCase } from "@/domain/usecases/adopt/CreateAdoptionRequestUseCase";
import { GetAdminAdoptionRequestsUseCase } from "@/domain/usecases/adopt/GetAdminAdoptionRequestsUseCase";
import { GetAdoptionRequestDetailUseCase } from "@/domain/usecases/adopt/GetAdoptionRequestDetailUseCase";
import { RequestAdoptionInfoUseCase } from "@/domain/usecases/adopt/RequestAdoptionInfoUseCase";
import { UpdateAdoptionRequestStatusUseCase } from "@/domain/usecases/adopt/UpdateAdoptionRequestStatusUseCase";
import { GetSessionUseCase } from "@/domain/usecases/auth/GetSessionUseCase";
import { LoginUseCase } from "@/domain/usecases/auth/LoginUseCase";
import { LogoutUseCase } from "@/domain/usecases/auth/LogoutUseCase";
import { RegisterExternalUserUseCase } from "@/domain/usecases/auth/RegisterExternalUserUseCase";
import { RegisterFoundationUseCase } from "@/domain/usecases/auth/RegisterFoundationUseCase";
import { GetDashboardDataUseCase } from "@/domain/usecases/dashboard/GetDashboardDataUseCase";
import { GetFoundationProfileUseCase } from "@/domain/usecases/foundation/GetFoundationProfileUseCase";
import { GetFeaturedFoundationsUseCase } from "@/domain/usecases/foundation/GetFeaturedFoundationsUseCase";
import { GetFoundationContactsUseCase } from "@/domain/usecases/foundation/GetFoundationContactsUseCase";
import { UpdateFoundationProfileUseCase } from "@/domain/usecases/foundation/UpdateFoundationProfileUseCase";
import { AddToCartUseCase } from "@/domain/usecases/cart/AddToCartUseCase";
import { GetCartItemsUseCase } from "@/domain/usecases/cart/GetCartItemsUseCase";
import { GetCartProductsUseCase } from "@/domain/usecases/cart/GetCartProductsUseCase";
import { UpdateCartItemQuantityUseCase } from "@/domain/usecases/cart/UpdateCartItemQuantityUseCase";
import { CreateProductUseCase } from "@/domain/usecases/products/CreateProductUseCase";
import { DeleteProductUseCase } from "@/domain/usecases/products/DeleteProductUseCase";
import { GetProductsUseCase } from "@/domain/usecases/products/GetProductsUseCase";
import { GetProductByIdUseCase } from "@/domain/usecases/products/GetProductByIdUseCase";
import { UpdateProductPublishStatusUseCase } from "@/domain/usecases/products/UpdateProductPublishStatusUseCase";
import { UpdateProductUseCase } from "@/domain/usecases/products/UpdateProductUseCase";
import { GetNotificationsUseCase } from "@/domain/usecases/notifications/GetNotificationsUseCase";
import { MarkNotificationAsReadUseCase } from "@/domain/usecases/notifications/MarkNotificationAsReadUseCase";
import { GetPrivateFileUrlUseCase } from "@/domain/usecases/storage/GetPrivateFileUrlUseCase";
import { UploadPrivateFileUseCase } from "@/domain/usecases/storage/UploadPrivateFileUseCase";
import { ChangePasswordUseCase } from "@/domain/usecases/account/ChangePasswordUseCase";
import { DeleteUserAccountUseCase } from "@/domain/usecases/account/DeleteUserAccountUseCase";
import { GetUserProfileUseCase } from "@/domain/usecases/account/GetUserProfileUseCase";
import { UpdateUserProfileUseCase } from "@/domain/usecases/account/UpdateUserProfileUseCase";
import type { INotificationRepository } from "@/domain/repositories/INotificationRepository";
import type { IPrivateFileStorage } from "@/domain/repositories/IPrivateFileStorage";
import { REPOSITORY_TYPES } from "../repositories/repositories.types";
import { USE_CASE_TYPES } from "./usecases.types";
import { getPublicImageBucket } from "@/infrastructure/config/environment";
import { DeletePublicImageUseCase } from "@/domain/usecases/storage/DeletePublicImageUseCase";

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
    bind<GetFeaturedFoundationsUseCase>(USE_CASE_TYPES.GetFeaturedFoundationsUseCase)
      .toDynamicValue((context) => {
        const foundationRepository = context.get<IFoundationRepository>(
          REPOSITORY_TYPES.FoundationRepository,
        );

        return new GetFeaturedFoundationsUseCase(foundationRepository);
      })
      .inSingletonScope();
    bind<GetHomeProductsUseCase>(USE_CASE_TYPES.GetHomeProductsUseCase)
      .toDynamicValue((context) => {
        const productRepository = context.get<IProductRepository>(
          REPOSITORY_TYPES.ProductRepository,
        );

        return new GetHomeProductsUseCase(productRepository);
      })
      .inSingletonScope();

    bind<GetAdoptCatalogUseCase>(USE_CASE_TYPES.GetAdoptCatalogUseCase)
      .toDynamicValue((context) => {
        const animalRepository = context.get<IAnimalRepository>(REPOSITORY_TYPES.AnimalRepository);

        return new GetAdoptCatalogUseCase(animalRepository);
      })
      .inSingletonScope();

    bind<GetAdoptDetailUseCase>(USE_CASE_TYPES.GetAdoptDetailUseCase)
      .toDynamicValue((context) => {
        const animalRepository = context.get<IAnimalRepository>(REPOSITORY_TYPES.AnimalRepository);

        return new GetAdoptDetailUseCase(animalRepository);
      })
      .inSingletonScope();

    bind<CreateAdoptionRequestUseCase>(USE_CASE_TYPES.CreateAdoptionRequestUseCase)
      .toDynamicValue((context) => {
        const adoptionRequestRepository = context.get<IAdoptionRequestRepository>(
          REPOSITORY_TYPES.AdoptionRequestRepository,
        );
        const authRepository = context.get<IAuthRepository>(REPOSITORY_TYPES.AuthRepository);

        return new CreateAdoptionRequestUseCase(adoptionRequestRepository, authRepository);
      })
      .inSingletonScope();

    bind<GetAdminAdoptionRequestsUseCase>(USE_CASE_TYPES.GetAdminAdoptionRequestsUseCase)
      .toDynamicValue((context) => {
        const adoptionRequestRepository = context.get<IAdoptionRequestRepository>(
          REPOSITORY_TYPES.AdoptionRequestRepository,
        );
        const authRepository = context.get<IAuthRepository>(REPOSITORY_TYPES.AuthRepository);
        const foundationMembershipRepository = context.get<IFoundationMembershipRepository>(
          REPOSITORY_TYPES.FoundationMembershipRepository,
        );

        return new GetAdminAdoptionRequestsUseCase(
          adoptionRequestRepository,
          authRepository,
          foundationMembershipRepository,
        );
      })
      .inSingletonScope();

    bind<GetAdoptionRequestDetailUseCase>(USE_CASE_TYPES.GetAdoptionRequestDetailUseCase)
      .toDynamicValue((context) => {
        const adoptionRequestRepository = context.get<IAdoptionRequestRepository>(
          REPOSITORY_TYPES.AdoptionRequestRepository,
        );
        const authRepository = context.get<IAuthRepository>(REPOSITORY_TYPES.AuthRepository);
        const foundationMembershipRepository = context.get<IFoundationMembershipRepository>(
          REPOSITORY_TYPES.FoundationMembershipRepository,
        );

        return new GetAdoptionRequestDetailUseCase(
          adoptionRequestRepository,
          authRepository,
          foundationMembershipRepository,
        );
      })
      .inSingletonScope();

    bind<UpdateAdoptionRequestStatusUseCase>(USE_CASE_TYPES.UpdateAdoptionRequestStatusUseCase)
      .toDynamicValue((context) => {
        const adoptionRequestRepository = context.get<IAdoptionRequestRepository>(
          REPOSITORY_TYPES.AdoptionRequestRepository,
        );
        const authRepository = context.get<IAuthRepository>(REPOSITORY_TYPES.AuthRepository);
        const foundationMembershipRepository = context.get<IFoundationMembershipRepository>(
          REPOSITORY_TYPES.FoundationMembershipRepository,
        );

        return new UpdateAdoptionRequestStatusUseCase(
          adoptionRequestRepository,
          authRepository,
          foundationMembershipRepository,
        );
      })
      .inSingletonScope();

    bind<RequestAdoptionInfoUseCase>(USE_CASE_TYPES.RequestAdoptionInfoUseCase)
      .toDynamicValue((context) => {
        const adoptionRequestRepository = context.get<IAdoptionRequestRepository>(
          REPOSITORY_TYPES.AdoptionRequestRepository,
        );
        const authRepository = context.get<IAuthRepository>(REPOSITORY_TYPES.AuthRepository);
        const foundationMembershipRepository = context.get<IFoundationMembershipRepository>(
          REPOSITORY_TYPES.FoundationMembershipRepository,
        );

        return new RequestAdoptionInfoUseCase(
          adoptionRequestRepository,
          authRepository,
          foundationMembershipRepository,
        );
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

    bind<GetAnimalByIdUseCase>(USE_CASE_TYPES.GetAnimalByIdUseCase)
      .toDynamicValue((context) => {
        const animalRepository = context.get<IAnimalRepository>(REPOSITORY_TYPES.AnimalRepository);
        const authRepository = context.get<IAuthRepository>(REPOSITORY_TYPES.AuthRepository);
        const foundationMembershipRepository = context.get<IFoundationMembershipRepository>(
          REPOSITORY_TYPES.FoundationMembershipRepository,
        );

        return new GetAnimalByIdUseCase(animalRepository, authRepository, foundationMembershipRepository);
      })
      .inSingletonScope();

    bind<UploadPublicImageUseCase>(USE_CASE_TYPES.UploadPublicImageUseCase)
      .toDynamicValue((context) => {
        const publicImageStorage = context.get<IPublicImageStorage>(REPOSITORY_TYPES.PublicImageStorage);

        return new UploadPublicImageUseCase(publicImageStorage);
      })
      .inSingletonScope();

    bind<DeletePublicImageUseCase>(USE_CASE_TYPES.DeletePublicImageUseCase)
      .toDynamicValue((context) => {
        const publicImageStorage = context.get<IPublicImageStorage>(REPOSITORY_TYPES.PublicImageStorage);

        return new DeletePublicImageUseCase(publicImageStorage);
      })
      .inSingletonScope();

    bind<CreateAnimalUseCase>(USE_CASE_TYPES.CreateAnimalUseCase)
      .toDynamicValue((context) => {
        const animalRepository = context.get<IAnimalRepository>(REPOSITORY_TYPES.AnimalRepository);
        const authRepository = context.get<IAuthRepository>(REPOSITORY_TYPES.AuthRepository);
        const foundationMembershipRepository = context.get<IFoundationMembershipRepository>(
          REPOSITORY_TYPES.FoundationMembershipRepository,
        );
        const uploadPublicImageUseCase = context.get<UploadPublicImageUseCase>(
          USE_CASE_TYPES.UploadPublicImageUseCase,
        );

        return new CreateAnimalUseCase(
          animalRepository,
          authRepository,
          foundationMembershipRepository,
          uploadPublicImageUseCase,
        );
      })
      .inSingletonScope();

    bind<UpdateAnimalUseCase>(USE_CASE_TYPES.UpdateAnimalUseCase)
      .toDynamicValue((context) => {
        const animalRepository = context.get<IAnimalRepository>(REPOSITORY_TYPES.AnimalRepository);
        const authRepository = context.get<IAuthRepository>(REPOSITORY_TYPES.AuthRepository);
        const foundationMembershipRepository = context.get<IFoundationMembershipRepository>(
          REPOSITORY_TYPES.FoundationMembershipRepository,
        );
        const deletePublicImageUseCase = context.get<DeletePublicImageUseCase>(
          USE_CASE_TYPES.DeletePublicImageUseCase,
        );
        const uploadPublicImageUseCase = context.get<UploadPublicImageUseCase>(
          USE_CASE_TYPES.UploadPublicImageUseCase,
        );

        return new UpdateAnimalUseCase(
          animalRepository,
          authRepository,
          foundationMembershipRepository,
          deletePublicImageUseCase,
          uploadPublicImageUseCase,
        );
      })
      .inSingletonScope();

    bind<DeleteAnimalUseCase>(USE_CASE_TYPES.DeleteAnimalUseCase)
      .toDynamicValue((context) => {
        const animalRepository = context.get<IAnimalRepository>(REPOSITORY_TYPES.AnimalRepository);
        const authRepository = context.get<IAuthRepository>(REPOSITORY_TYPES.AuthRepository);
        const foundationMembershipRepository = context.get<IFoundationMembershipRepository>(
          REPOSITORY_TYPES.FoundationMembershipRepository,
        );
        const deletePublicImageUseCase = context.get<DeletePublicImageUseCase>(
          USE_CASE_TYPES.DeletePublicImageUseCase,
        );

        return new DeleteAnimalUseCase(
          animalRepository,
          authRepository,
          foundationMembershipRepository,
          deletePublicImageUseCase,
        );
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
        const adoptionRequestRepository = context.get<IAdoptionRequestRepository>(
          REPOSITORY_TYPES.AdoptionRequestRepository,
        );

        return new GetDashboardDataUseCase(
          animalRepository,
          eventRepository,
          productRepository,
          authRepository,
          foundationRepository,
          foundationMembershipRepository,
          adoptionRequestRepository,
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

    bind<RegisterExternalUserUseCase>(USE_CASE_TYPES.RegisterExternalUserUseCase)
      .toDynamicValue((context) => {
        const authRepository = context.get<IAuthRepository>(REPOSITORY_TYPES.AuthRepository);

        return new RegisterExternalUserUseCase(authRepository);
      })
      .inSingletonScope();

    bind<LoginUseCase>(USE_CASE_TYPES.LoginUseCase)
      .toDynamicValue((context) => {
        const authRepository = context.get<IAuthRepository>(REPOSITORY_TYPES.AuthRepository);

        return new LoginUseCase(authRepository);
      })
      .inSingletonScope();

    bind<LogoutUseCase>(USE_CASE_TYPES.LogoutUseCase)
      .toDynamicValue((context) => {
        const authRepository = context.get<IAuthRepository>(REPOSITORY_TYPES.AuthRepository);

        return new LogoutUseCase(authRepository);
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

    bind<GetUserProfileUseCase>(USE_CASE_TYPES.GetUserProfileUseCase)
      .toDynamicValue((context) => {
        const userProfileRepository = context.get<IUserProfileRepository>(
          REPOSITORY_TYPES.UserProfileRepository,
        );

        return new GetUserProfileUseCase(userProfileRepository);
      })
      .inSingletonScope();

    bind<UpdateUserProfileUseCase>(USE_CASE_TYPES.UpdateUserProfileUseCase)
      .toDynamicValue((context) => {
        const userProfileRepository = context.get<IUserProfileRepository>(
          REPOSITORY_TYPES.UserProfileRepository,
        );

        return new UpdateUserProfileUseCase(userProfileRepository);
      })
      .inSingletonScope();

    bind<ChangePasswordUseCase>(USE_CASE_TYPES.ChangePasswordUseCase)
      .toDynamicValue((context) => {
        const userProfileRepository = context.get<IUserProfileRepository>(
          REPOSITORY_TYPES.UserProfileRepository,
        );

        return new ChangePasswordUseCase(userProfileRepository);
      })
      .inSingletonScope();

    bind<DeleteUserAccountUseCase>(USE_CASE_TYPES.DeleteUserAccountUseCase)
      .toDynamicValue((context) => {
        const userProfileRepository = context.get<IUserProfileRepository>(
          REPOSITORY_TYPES.UserProfileRepository,
        );

        return new DeleteUserAccountUseCase(userProfileRepository);
      })
      .inSingletonScope();

    bind<GetFoundationContactsUseCase>(USE_CASE_TYPES.GetFoundationContactsUseCase)
      .toDynamicValue((context) => {
        const foundationRepository = context.get<IFoundationRepository>(REPOSITORY_TYPES.FoundationRepository);

        return new GetFoundationContactsUseCase(foundationRepository);
      })
      .inSingletonScope();

    bind<UpdateFoundationProfileUseCase>(USE_CASE_TYPES.UpdateFoundationProfileUseCase)
      .toDynamicValue((context) => {
        const foundationProfileRepository = context.get<IFoundationProfileRepository>(
          REPOSITORY_TYPES.FoundationProfileRepository,
        );
        const uploadPublicImageUseCase = context.get<UploadPublicImageUseCase>(
          USE_CASE_TYPES.UploadPublicImageUseCase,
        );
        const deletePublicImageUseCase = context.get<DeletePublicImageUseCase>(
          USE_CASE_TYPES.DeletePublicImageUseCase,
        );

        return new UpdateFoundationProfileUseCase(
          foundationProfileRepository,
          uploadPublicImageUseCase,
          deletePublicImageUseCase,
        );
      })
      .inSingletonScope();

    bind<GetShopCatalogUseCase>(USE_CASE_TYPES.GetShopCatalogUseCase)
      .toDynamicValue((context) => {
        const productRepository = context.get<IProductRepository>(REPOSITORY_TYPES.ProductRepository);
        const foundationRepository = context.get<IFoundationRepository>(REPOSITORY_TYPES.FoundationRepository);

        return new GetShopCatalogUseCase(productRepository, foundationRepository);
      })
      .inSingletonScope();

    bind<GetProductDetailUseCase>(USE_CASE_TYPES.GetProductDetailUseCase)
      .toDynamicValue((context) => {
        const productRepository = context.get<IProductRepository>(REPOSITORY_TYPES.ProductRepository);
        const foundationRepository = context.get<IFoundationRepository>(REPOSITORY_TYPES.FoundationRepository);

        return new GetProductDetailUseCase(productRepository, foundationRepository);
      })
      .inSingletonScope();

    bind<GetRelatedProductsUseCase>(USE_CASE_TYPES.GetRelatedProductsUseCase)
      .toDynamicValue((context) => {
        const productRepository = context.get<IProductRepository>(REPOSITORY_TYPES.ProductRepository);

        return new GetRelatedProductsUseCase(productRepository);
      })
      .inSingletonScope();

    bind<GetCartItemsUseCase>(USE_CASE_TYPES.GetCartItemsUseCase)
      .toDynamicValue((context) => {
        const cartRepository = context.get<ICartRepository>(REPOSITORY_TYPES.CartRepository);

        return new GetCartItemsUseCase(cartRepository);
      })
      .inSingletonScope();

    bind<AddToCartUseCase>(USE_CASE_TYPES.AddToCartUseCase)
      .toDynamicValue((context) => {
        const cartRepository = context.get<ICartRepository>(REPOSITORY_TYPES.CartRepository);

        return new AddToCartUseCase(cartRepository);
      })
      .inSingletonScope();

    bind<UpdateCartItemQuantityUseCase>(USE_CASE_TYPES.UpdateCartItemQuantityUseCase)
      .toDynamicValue((context) => {
        const cartRepository = context.get<ICartRepository>(REPOSITORY_TYPES.CartRepository);

        return new UpdateCartItemQuantityUseCase(cartRepository);
      })
      .inSingletonScope();

    bind<GetCartProductsUseCase>(USE_CASE_TYPES.GetCartProductsUseCase)
      .toDynamicValue((context) => {
        const productRepository = context.get<IProductRepository>(REPOSITORY_TYPES.ProductRepository);

        return new GetCartProductsUseCase(productRepository);
      })
      .inSingletonScope();

    bind<GetProductsUseCase>(USE_CASE_TYPES.GetProductsUseCase)
      .toDynamicValue((context) => {
        const productRepository = context.get<IProductRepository>(REPOSITORY_TYPES.ProductRepository);
        const authRepository = context.get<IAuthRepository>(REPOSITORY_TYPES.AuthRepository);
        const foundationMembershipRepository = context.get<IFoundationMembershipRepository>(
          REPOSITORY_TYPES.FoundationMembershipRepository,
        );

        return new GetProductsUseCase(productRepository, authRepository, foundationMembershipRepository);
      })
      .inSingletonScope();

    bind<CreateProductUseCase>(USE_CASE_TYPES.CreateProductUseCase)
      .toDynamicValue((context) => {
        const productRepository = context.get<IProductRepository>(REPOSITORY_TYPES.ProductRepository);
        const authRepository = context.get<IAuthRepository>(REPOSITORY_TYPES.AuthRepository);
        const foundationMembershipRepository = context.get<IFoundationMembershipRepository>(
          REPOSITORY_TYPES.FoundationMembershipRepository,
        );

        return new CreateProductUseCase(productRepository, authRepository, foundationMembershipRepository);
      })
      .inSingletonScope();

    bind<GetProductByIdUseCase>(USE_CASE_TYPES.GetProductByIdUseCase)
      .toDynamicValue((context) => {
        const productRepository = context.get<IProductRepository>(REPOSITORY_TYPES.ProductRepository);
        const authRepository = context.get<IAuthRepository>(REPOSITORY_TYPES.AuthRepository);
        const foundationMembershipRepository = context.get<IFoundationMembershipRepository>(
          REPOSITORY_TYPES.FoundationMembershipRepository,
        );

        return new GetProductByIdUseCase(productRepository, authRepository, foundationMembershipRepository);
      })
      .inSingletonScope();

    bind<UpdateProductPublishStatusUseCase>(USE_CASE_TYPES.UpdateProductPublishStatusUseCase)
      .toDynamicValue((context) => {
        const productRepository = context.get<IProductRepository>(REPOSITORY_TYPES.ProductRepository);
        const authRepository = context.get<IAuthRepository>(REPOSITORY_TYPES.AuthRepository);
        const foundationMembershipRepository = context.get<IFoundationMembershipRepository>(
          REPOSITORY_TYPES.FoundationMembershipRepository,
        );

        return new UpdateProductPublishStatusUseCase(
          productRepository,
          authRepository,
          foundationMembershipRepository,
        );
      })
      .inSingletonScope();

    bind<UpdateProductUseCase>(USE_CASE_TYPES.UpdateProductUseCase)
      .toDynamicValue((context) => {
        const productRepository = context.get<IProductRepository>(REPOSITORY_TYPES.ProductRepository);
        const authRepository = context.get<IAuthRepository>(REPOSITORY_TYPES.AuthRepository);
        const foundationMembershipRepository = context.get<IFoundationMembershipRepository>(
          REPOSITORY_TYPES.FoundationMembershipRepository,
        );
        const deletePublicImageUseCase = context.get<DeletePublicImageUseCase>(
          USE_CASE_TYPES.DeletePublicImageUseCase,
        );

        return new UpdateProductUseCase(
          productRepository,
          authRepository,
          foundationMembershipRepository,
          deletePublicImageUseCase,
        );
      })
      .inSingletonScope();

    bind<DeleteProductUseCase>(USE_CASE_TYPES.DeleteProductUseCase)
      .toDynamicValue((context) => {
        const productRepository = context.get<IProductRepository>(REPOSITORY_TYPES.ProductRepository);
        const authRepository = context.get<IAuthRepository>(REPOSITORY_TYPES.AuthRepository);
        const foundationMembershipRepository = context.get<IFoundationMembershipRepository>(
          REPOSITORY_TYPES.FoundationMembershipRepository,
        );
        const deletePublicImageUseCase = context.get<DeletePublicImageUseCase>(
          USE_CASE_TYPES.DeletePublicImageUseCase,
        );

        return new DeleteProductUseCase(
          productRepository,
          authRepository,
          foundationMembershipRepository,
          deletePublicImageUseCase,
        );
      })
      .inSingletonScope();

    bind<GetNotificationsUseCase>(USE_CASE_TYPES.GetNotificationsUseCase)
      .toDynamicValue((context) => {
        const notificationRepository = context.get<INotificationRepository>(
          REPOSITORY_TYPES.NotificationRepository,
        );
        const authRepository = context.get<IAuthRepository>(REPOSITORY_TYPES.AuthRepository);

        return new GetNotificationsUseCase(notificationRepository, authRepository);
      })
      .inSingletonScope();

    bind<MarkNotificationAsReadUseCase>(USE_CASE_TYPES.MarkNotificationAsReadUseCase)
      .toDynamicValue((context) => {
        const notificationRepository = context.get<INotificationRepository>(
          REPOSITORY_TYPES.NotificationRepository,
        );
        const authRepository = context.get<IAuthRepository>(REPOSITORY_TYPES.AuthRepository);

        return new MarkNotificationAsReadUseCase(notificationRepository, authRepository);
      })
      .inSingletonScope();

    bind<UploadPrivateFileUseCase>(USE_CASE_TYPES.UploadPrivateFileUseCase)
      .toDynamicValue((context) => {
        const privateFileStorage = context.get<IPrivateFileStorage>(REPOSITORY_TYPES.PrivateFileStorage);

        return new UploadPrivateFileUseCase(privateFileStorage);
      })
      .inSingletonScope();

    bind<GetPrivateFileUrlUseCase>(USE_CASE_TYPES.GetPrivateFileUrlUseCase)
      .toDynamicValue((context) => {
        const privateFileStorage = context.get<IPrivateFileStorage>(REPOSITORY_TYPES.PrivateFileStorage);
        const authRepository = context.get<IAuthRepository>(REPOSITORY_TYPES.AuthRepository);
        const adoptionRequestRepository = context.get<IAdoptionRequestRepository>(
          REPOSITORY_TYPES.AdoptionRequestRepository,
        );
        const foundationMembershipRepository = context.get<IFoundationMembershipRepository>(
          REPOSITORY_TYPES.FoundationMembershipRepository,
        );

        return new GetPrivateFileUrlUseCase(
          privateFileStorage,
          authRepository,
          adoptionRequestRepository,
          foundationMembershipRepository,
        );
      })
      .inSingletonScope();
  },
);

const useCaseModules = [useCasesModule];

export { useCaseModules, useCasesModule };
