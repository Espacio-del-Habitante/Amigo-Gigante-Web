import assert from "node:assert/strict";
import { test } from "node:test";

import type { IAuthRepository } from "@/domain/repositories/IAuthRepository";
import type { IFoundationMembershipRepository } from "@/domain/repositories/IFoundationMembershipRepository";
import type { IProductRepository, DeleteProductParams } from "@/domain/repositories/IProductRepository";
import type { ShopProduct } from "@/domain/models/ShopProduct";
import { DeleteProductUseCase } from "@/domain/usecases/products/DeleteProductUseCase";
import type { DeletePublicImageUseCase } from "@/domain/usecases/storage/DeletePublicImageUseCase";

const baseProduct: ShopProduct = {
  id: 10,
  foundationId: "foundation-1",
  name: "Test Product",
  description: "Desc",
  price: 25,
  imageUrl: "https://project.supabase.co/storage/v1/object/public/amg-public-image/products/foundation-1/old.png",
  isPublished: true,
  createdAt: "2024-01-01T00:00:00Z",
};

const authRepository: IAuthRepository = {
  signUp: async () => {
    throw new Error("not-used");
  },
  signIn: async () => {
    throw new Error("not-used");
  },
  getSession: async () => ({
    user: { id: "user-1", email: "user@example.com", role: "foundation_user" },
    session: null,
  }),
  createProfile: async () => {},
};

const foundationMembershipRepository: IFoundationMembershipRepository = {
  getFoundationIdForUser: async () => "foundation-1",
};

test("DeleteProductUseCase deletes image before removing product", async () => {
  let deletedUrl: string | null = null;
  let deleteParams: DeleteProductParams | null = null;

  const productRepository = {
    getProductById: async () => baseProduct,
    deleteProduct: async (params) => {
      deleteParams = params;
    },
  } as IProductRepository;

  const deletePublicImageUseCase = {
    execute: async ({ url }: { url: string }) => {
      deletedUrl = url;
    },
  } as DeletePublicImageUseCase;

  const useCase = new DeleteProductUseCase(
    productRepository,
    authRepository,
    foundationMembershipRepository,
    deletePublicImageUseCase,
  );

  await useCase.execute({ productId: 10 });

  assert.equal(deletedUrl, baseProduct.imageUrl);
  assert.equal(deleteParams?.productId, 10);
});

test("DeleteProductUseCase proceeds when image deletion fails", async () => {
  let deleteParams: DeleteProductParams | null = null;

  const productRepository = {
    getProductById: async () => baseProduct,
    deleteProduct: async (params) => {
      deleteParams = params;
    },
  } as IProductRepository;

  const deletePublicImageUseCase = {
    execute: async () => {
      throw new Error("delete-error");
    },
  } as DeletePublicImageUseCase;

  const useCase = new DeleteProductUseCase(
    productRepository,
    authRepository,
    foundationMembershipRepository,
    deletePublicImageUseCase,
  );

  await useCase.execute({ productId: 10 });

  assert.equal(deleteParams?.productId, 10);
});

test("DeleteProductUseCase skips deletion when product has no image", async () => {
  let deleteCalls = 0;

  const productRepository = {
    getProductById: async () => ({ ...baseProduct, imageUrl: null }),
    deleteProduct: async () => {},
  } as IProductRepository;

  const deletePublicImageUseCase = {
    execute: async () => {
      deleteCalls += 1;
    },
  } as DeletePublicImageUseCase;

  const useCase = new DeleteProductUseCase(
    productRepository,
    authRepository,
    foundationMembershipRepository,
    deletePublicImageUseCase,
  );

  await useCase.execute({ productId: 10 });

  assert.equal(deleteCalls, 0);
});
