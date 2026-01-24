import assert from "node:assert/strict";
import { test } from "node:test";

import type { AnimalManagement } from "@/domain/models/AnimalManagement";
import type { IAdoptionRequestRepository } from "@/domain/repositories/IAdoptionRequestRepository";
import type { IAnimalRepository } from "@/domain/repositories/IAnimalRepository";
import type { IAuthRepository } from "@/domain/repositories/IAuthRepository";
import type { IEventRepository } from "@/domain/repositories/IEventRepository";
import type { IFoundationMembershipRepository } from "@/domain/repositories/IFoundationMembershipRepository";
import type { IFoundationRepository } from "@/domain/repositories/IFoundationRepository";
import type { IProductRepository } from "@/domain/repositories/IProductRepository";
import { GetDashboardDataUseCase } from "@/domain/usecases/dashboard/GetDashboardDataUseCase";

test("GetDashboardDataUseCase returns KPI and funnel data from repositories", async () => {
  const animalRepository: IAnimalRepository = {
    getHomeAnimals: async () => ({ heroAnimals: [], featuredAnimals: [] }),
    getAnimals: async () => ({ animals: [], total: 0 }),
    getAnimalsCount: async () => 8,
    getRecentAnimals: async () => [],
    getAnimalsInTreatment: async () => [],
    createAnimal: async () => {
      throw new Error("not-used");
    },
    createAnimalPhotos: async () => {},
    deleteAnimal: async () => {},
    deleteAnimalPhotos: async () => {},
    getAnimalById: async () => {
      throw new Error("not-used");
    },
    updateAnimal: async () => {},
    replaceAnimalPhotos: async () => {},
    getAdoptCatalog: async () => ({ items: [], total: 0 }),
    getAdoptDetail: async () => {
      throw new Error("not-used");
    },
    getRelatedAnimals: async () => [],
  };

  const eventRepository: IEventRepository = {
    getRecentEvents: async () => [],
  };

  const productRepository: IProductRepository = {
    getRecentProducts: async () => [],
    getShopProducts: async () => ({ items: [], total: 0 }),
    getProductDetail: async () => {
      throw new Error("not-used");
    },
    getRelatedProducts: async () => [],
    getProductsByIds: async () => [],
    getProducts: async () => ({ products: [], total: 0 }),
    getProductById: async () => {
      throw new Error("not-used");
    },
    createProduct: async () => {
      throw new Error("not-used");
    },
    updatePublishStatus: async () => {},
    updateProduct: async () => {},
    deleteProduct: async () => {},
  };

  const authRepository: IAuthRepository = {
    signUp: async () => {
      throw new Error("not-used");
    },
    signIn: async () => {
      throw new Error("not-used");
    },
    getSession: async () => ({
      accessToken: "token",
      refreshToken: null,
      expiresAt: null,
      user: { id: "user-1", email: "test@example.com", role: "foundation_user" },
    }),
    createProfile: async () => {},
  };

  const foundationRepository: IFoundationRepository = {
    createFoundation: async () => {
      throw new Error("not-used");
    },
    createFoundationContact: async () => {},
    createFoundationMember: async () => {},
    getFoundationById: async () => ({ id: "foundation-1", name: "Amigos", taxId: null }),
    getShopFoundationById: async () => {
      throw new Error("not-used");
    },
    getFoundationsList: async () => [],
    getFeaturedFoundations: async () => [],
    getFoundationContacts: async () => {
      throw new Error("not-used");
    },
    rollbackFoundation: async () => {},
  };

  const foundationMembershipRepository: IFoundationMembershipRepository = {
    getFoundationIdForUser: async () => "foundation-1",
  };

  const adoptionRequestRepository: IAdoptionRequestRepository = {
    createAdoptionRequest: async () => {
      throw new Error("not-used");
    },
    getAdoptionRequestsCounts: async () => ({
      total: 10,
      byStatus: {
        pending: 2,
        in_review: 1,
        info_requested: 0,
        preapproved: 3,
        approved: 2,
        rejected: 1,
        cancelled: 0,
        completed: 1,
      },
    }),
    getAdminRequests: async () => {
      throw new Error("not-used");
    },
    getUserRequests: async () => ({ requests: [] }),
    getRequestDetail: async () => {
      throw new Error("not-used");
    },
    getRequestAccessInfo: async () => {
      throw new Error("not-used");
    },
    getAdopterEmailByUserId: async () => null,
    enqueueInfoRequestEmail: async () => {},
    saveResponseMessage: async () => {},
    notifyFoundationMembers: async () => {},
    updateStatus: async () => {},
    updateStatusByAdopter: async () => {},
  };

  const useCase = new GetDashboardDataUseCase(
    animalRepository,
    eventRepository,
    productRepository,
    authRepository,
    foundationRepository,
    foundationMembershipRepository,
    adoptionRequestRepository,
  );

  const result = await useCase.execute();

  const kpiKeys = result.kpis.map((kpi) => kpi.key);
  assert.deepEqual(kpiKeys, ["animalsInCare", "pendingAdoptions"]);
  assert.equal(result.kpis[0].value, 8);
  assert.equal(result.kpis[1].value, 2);
  assert.equal(result.adoptionFunnel.applicationsReceived, 10);
  assert.equal(result.adoptionFunnel.interviewsScheduled, 3);
  assert.equal(result.adoptionFunnel.homeVisits, 3);
  assert.equal(result.adoptionFunnel.adoptionsCompleted, 1);
  assert.deepEqual(result.attentionAlerts, []);
  assert.deepEqual(result.animalsInTreatment as AnimalManagement[], []);
});
