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

export const parsePriceInput = (value?: string | null): number | null => {
  if (!value) return null;
  const digits = value.replace(/[^\d]/g, "");
  if (!digits) return null;
  const parsed = Number(digits);
  return Number.isFinite(parsed) ? parsed : null;
};

const isValidImageUrl = (value?: string | null): boolean => {
  if (!value) return true;
  const trimmed = value.trim();
  if (!trimmed) return true;
  if (trimmed.startsWith("data:")) return true;
  return Yup.string().url().isValidSync(trimmed);
};

export const createProductFormValidationSchema = (t: ProductFormTranslator, hasImageFile: () => boolean) =>
  Yup.object().shape({
    name: Yup.string().trim().required(t("validation.nameRequired")),
    price: Yup.string()
      .trim()
      .required(t("validation.priceRequired"))
      .test("price-number", t("validation.priceRequired"), (value) => parsePriceInput(value) !== null)
      .test("price-min", t("validation.priceMin"), (value) => {
        const parsed = parsePriceInput(value);
        return parsed !== null && parsed >= 0;
      }),
    description: Yup.string().trim().required(t("validation.descriptionRequired")),
    imageUrl: Yup.string()
      .trim()
      .test("image-required", t("validation.imageRequired"), (value) => {
        if (hasImageFile()) return true;
        return Boolean(value && value.trim().length > 0);
      })
      .test("image-url", t("validation.imageUrlInvalid"), (value) => isValidImageUrl(value)),
    isPublished: Yup.boolean().notRequired(),
  });
