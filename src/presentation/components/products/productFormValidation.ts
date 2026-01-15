import type { useTranslations } from "next-intl";
import * as Yup from "yup";

export interface ProductFormValues {
  name: string;
  price: number | "";
  description: string;
  imageUrl: string;
  isPublished: boolean;
}

type ProductFormTranslator = ReturnType<typeof useTranslations>;

export const createProductFormValidationSchema = (t: ProductFormTranslator, hasImageFile: () => boolean) =>
  Yup.object().shape({
    name: Yup.string().trim().required(t("validation.nameRequired")),
    price: Yup.number()
      .typeError(t("validation.priceRequired"))
      .required(t("validation.priceRequired"))
      .min(0, t("validation.priceMin")),
    description: Yup.string().trim().required(t("validation.descriptionRequired")),
    imageUrl: Yup.string()
      .trim()
      .test("image-required", t("validation.imageRequired"), (value) => {
        if (hasImageFile()) return true;
        return Boolean(value && value.trim().length > 0);
      })
      .test("image-url", t("validation.imageUrlInvalid"), (value) => {
        if (!value) return true;
        return Yup.string().url().isValidSync(value);
      }),
    isPublished: Yup.boolean().notRequired(),
  });
