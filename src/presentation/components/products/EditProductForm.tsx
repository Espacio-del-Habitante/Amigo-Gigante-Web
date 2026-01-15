"use client";

import type { FormikHelpers } from "formik";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { GetProductByIdUseCase } from "@/domain/usecases/products/GetProductByIdUseCase";
import { UpdateProductUseCase } from "@/domain/usecases/products/UpdateProductUseCase";
import { appContainer } from "@/infrastructure/ioc/container";
import { USE_CASE_TYPES } from "@/infrastructure/ioc/usecases/usecases.types";
import { ProductForm } from "@/presentation/components/products/ProductForm";
import type { ProductFormValues } from "@/presentation/components/products/productFormValidation";

const emptyValues: ProductFormValues = {
  name: "",
  price: "",
  description: "",
  imageUrl: "",
  isPublished: false,
};

const loadErrorKeyList = ["errors.unauthorized", "errors.connection", "errors.notFound", "errors.generic"] as const;
type LoadErrorKey = (typeof loadErrorKeyList)[number];

const submitErrorKeyList = ["errors.unauthorized", "errors.connection", "errors.notFound", "errors.generic"] as const;
type SubmitErrorKey = (typeof submitErrorKeyList)[number];

export interface EditProductFormProps {
  productId: number;
}

export function EditProductForm({ productId }: EditProductFormProps) {
  const t = useTranslations("productForm");
  const locale = useLocale();
  const router = useRouter();
  const getProductByIdUseCase = useMemo(
    () => appContainer.get<GetProductByIdUseCase>(USE_CASE_TYPES.GetProductByIdUseCase),
    [],
  );
  const updateProductUseCase = useMemo(
    () => appContainer.get<UpdateProductUseCase>(USE_CASE_TYPES.UpdateProductUseCase),
    [],
  );

  const [initialValues, setInitialValues] = useState<ProductFormValues>(emptyValues);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const isLoadErrorKey = (value: string): value is LoadErrorKey =>
    (loadErrorKeyList as readonly string[]).includes(value);
  const isSubmitErrorKey = (value: string): value is SubmitErrorKey =>
    (submitErrorKeyList as readonly string[]).includes(value);

  const loadProduct = async () => {
    setIsLoading(true);
    setLoadError(null);
    setSubmitError(null);

    try {
      const product = await getProductByIdUseCase.execute({ productId });
      setInitialValues({
        name: product.name ?? "",
        price: product.price === null ? "" : String(product.price),
        description: product.description ?? "",
        imageUrl: product.imageUrl ?? "",
        isPublished: product.isPublished,
      });
    } catch (error) {
      if (error instanceof Error && isLoadErrorKey(error.message)) {
        setLoadError(t(error.message));
      } else {
        setLoadError(t("edit.errors.load"));
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadProduct();
  }, [productId]);

  const handleSubmit = async (values: ProductFormValues, helpers: FormikHelpers<ProductFormValues>) => {
    setSubmitError(null);

    try {
      const normalizedName = values.name.trim();
      const normalizedDescription = values.description.trim();
      const normalizedPrice = values.price.trim();
      const parsedPrice = normalizedPrice.length > 0 ? Number(normalizedPrice) : null;
      const priceValue = Number.isFinite(parsedPrice) ? parsedPrice : null;
      const imageUrl = values.imageUrl.trim() || null;

      await updateProductUseCase.execute({
        productId,
        name: normalizedName,
        description: normalizedDescription ? normalizedDescription : null,
        price: priceValue,
        imageUrl,
        isPublished: values.isPublished,
      });

      router.push(`/${locale}/foundations/products`);
    } catch (error) {
      if (error instanceof Error && isSubmitErrorKey(error.message)) {
        setSubmitError(t(error.message));
      } else {
        setSubmitError(t("edit.errors.generic"));
      }
    } finally {
      helpers.setSubmitting(false);
    }
  };

  return (
    <ProductForm
      initialValues={initialValues}
      onSubmit={handleSubmit}
      onCancel={() => router.push(`/${locale}/foundations/products`)}
      isLoading={isLoading}
      loadError={loadError}
      submitError={submitError}
      loadingLabel={t("edit.status.loading")}
    />
  );
}
