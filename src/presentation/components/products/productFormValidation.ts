import type { useTranslations } from "next-intl";
import * as Yup from "yup";

export interface ProductFormValues {
  name: string;
  price: string;
  description: string;
  imageUrl: string;
  isPublished: boolean;
}

type ProductFormTranslator = ReturnType<typeof useTranslations>;

const isValidImageUrl = (value?: string) => {
  const trimmed = value?.trim() ?? "";
  if (!trimmed) return true;
  if (trimmed.startsWith("data:")) return true;
  try {
    const parsed = new URL(trimmed);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
};

export const createProductFormValidationSchema = (t: ProductFormTranslator) =>
  Yup.object().shape({
    name: Yup.string().trim().required(t("validation.nameRequired")),
    price: Yup.string()
      .trim()
      .test("price-valid", t("validation.priceInvalid"), (value) => {
        if (!value) return true;
        const parsed = Number(value);
        return Number.isFinite(parsed) && parsed >= 0;
      }),
    description: Yup.string().trim().notRequired(),
    imageUrl: Yup.string()
      .trim()
      .test("image-url-valid", t("validation.imageUrlInvalid"), (value) => isValidImageUrl(value)),
    isPublished: Yup.boolean().required(),
  });
