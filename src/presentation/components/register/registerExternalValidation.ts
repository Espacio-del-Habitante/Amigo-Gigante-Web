import type { useTranslations } from "next-intl";
import * as Yup from "yup";

export interface RegisterExternalFormValues {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
}

type RegisterTranslator = ReturnType<typeof useTranslations>;

export const createRegisterExternalValidationSchema = (t: RegisterTranslator) =>
  Yup.object().shape({
    fullName: Yup.string()
      .trim()
      .required(t("external.validation.fullNameRequired"))
      .min(2, t("external.validation.fullNameMin")),
    email: Yup.string()
      .trim()
      .required(t("external.validation.emailRequired"))
      .email(t("external.validation.emailInvalid")),
    phone: Yup.string()
      .trim()
      .notRequired()
      .test("phone-format", t("external.validation.phoneInvalid"), (value) => {
        if (!value) return true;
        return /^[+()\d\s-]+$/.test(value);
      }),
    password: Yup.string()
      .required(t("external.validation.passwordRequired"))
      .min(8, t("external.validation.passwordMinLength")),
    confirmPassword: Yup.string()
      .required(t("external.validation.confirmPasswordRequired"))
      .oneOf([Yup.ref("password")], t("external.validation.passwordsMismatch")),
    acceptTerms: Yup.boolean()
      .required(t("external.validation.termsRequired"))
      .oneOf([true], t("external.validation.termsRequired")),
  });
