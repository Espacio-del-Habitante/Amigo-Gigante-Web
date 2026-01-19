import assert from "node:assert/strict";
import { test } from "node:test";

import type { IAuthRepository } from "@/domain/repositories/IAuthRepository";
import type { IFoundationMembershipRepository } from "@/domain/repositories/IFoundationMembershipRepository";
import type { IProductRepository, UpdateProductParams } from "@/domain/repositories/IProductRepository";
import type { ShopProduct } from "@/domain/models/ShopProduct";
import { UpdateProductUseCase } from "@/domain/usecases/products/UpdateProductUseCase";
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

test("UpdateProductUseCase deletes previous image when replacing it", async () => {
  let deletedUrl: string | null = null;
  let updateParams: UpdateProductParams | null = null;

  const productRepository = {
    getProductById: async () => baseProduct,
    updateProduct: async (params) => {
      updateParams = params;
    },
  } as IProductRepository;

  const deletePublicImageUseCase = {
    execute: async ({ url }: { url: string }) => {
      deletedUrl = url;
    },
  } as DeletePublicImageUseCase;

  const useCase = new UpdateProductUseCase(
    productRepository,
    authRepository,
    foundationMembershipRepository,
    deletePublicImageUseCase,
  );

  const file = { name: "new.png", size: 1024, type: "image/png" } as File;

  await useCase.execute({
    productId: 10,
    name: "Updated",
    description: "Updated",
    price: 20,
    imageUrl: baseProduct.imageUrl,
    imageFile: file,
    isPublished: true,
  });

  assert.equal(deletedUrl, baseProduct.imageUrl);
  assert.equal(updateParams?.productId, 10);
});

test("UpdateProductUseCase continues when deleting old image fails", async () => {
  let updateParams: UpdateProductParams | null = null;

  const productRepository = {
    getProductById: async () => baseProduct,
    updateProduct: async (params) => {
      updateParams = params;
    },
  } as IProductRepository;

  const deletePublicImageUseCase = {
    execute: async () => {
      throw new Error("delete-error");
    },
  } as DeletePublicImageUseCase;

  const useCase = new UpdateProductUseCase(
    productRepository,
    authRepository,
    foundationMembershipRepository,
    deletePublicImageUseCase,
  );

  await useCase.execute({
    productId: 10,
    name: "Updated",
    description: "Updated",
    price: 20,
    imageUrl: baseProduct.imageUrl,
    imageFile: { name: "new.png", size: 1024, type: "image/png" } as File,
    isPublished: true,
  });

  assert.equal(updateParams?.productId, 10);
});

test("UpdateProductUseCase skips deletion when image is unchanged", async () => {
  let deleteCalls = 0;

  const productRepository = {
    getProductById: async () => baseProduct,
    updateProduct: async () => {},
  } as IProductRepository;

  const deletePublicImageUseCase = {
    execute: async () => {
      deleteCalls += 1;
    },
  } as DeletePublicImageUseCase;

  const useCase = new UpdateProductUseCase(
    productRepository,
    authRepository,
    foundationMembershipRepository,
    deletePublicImageUseCase,
  );

  await useCase.execute({
    productId: 10,
    name: "Updated",
    description: "Updated",
    price: 20,
    imageUrl: baseProduct.imageUrl,
    isPublished: true,
  });

  assert.equal(deleteCalls, 0);
});
