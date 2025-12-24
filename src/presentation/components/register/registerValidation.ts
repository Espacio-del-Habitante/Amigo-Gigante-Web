import type { useTranslations } from "next-intl";
import * as Yup from "yup";

export interface RegisterFormValues {
  foundationName: string;
  officialEmail: string;
  taxId: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
}

type RegisterTranslator = ReturnType<typeof useTranslations>;

export const createRegisterValidationSchema = (t: RegisterTranslator) =>
  Yup.object().shape({
    foundationName: Yup.string()
      .trim()
      .required(t("validation.foundationNameRequired"))
      .min(3, t("validation.foundationNameMin")),
    officialEmail: Yup.string()
      .trim()
      .required(t("validation.officialEmailRequired"))
      .email(t("validation.officialEmailInvalid")),
    taxId: Yup.string()
      .trim()
      .notRequired()
      .test("tax-id-format", t("validation.taxIdInvalid"), (value) => {
        if (!value) return true;
        return /^[A-Za-z0-9-]+$/.test(value);
      }),
    password: Yup.string()
      .required(t("validation.passwordRequired"))
      .min(6, t("validation.passwordMin")),
    confirmPassword: Yup.string()
      .required(t("validation.confirmPasswordRequired"))
      .oneOf([Yup.ref("password")], t("validation.confirmPasswordMismatch")),
    acceptTerms: Yup.boolean()
      .required(t("validation.acceptTermsRequired"))
      .oneOf([true], t("validation.acceptTermsRequired")),
  });
