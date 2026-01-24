import type { useTranslations } from "next-intl";
import * as Yup from "yup";

export interface AccountFormValues {
  displayName: string;
  phone: string;
  email: string;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

type AccountTranslator = ReturnType<typeof useTranslations>;

export const createAccountValidationSchema = (t: AccountTranslator) =>
  Yup.object().shape({
    displayName: Yup.string()
      .trim()
      .required(t("validation.displayName.required"))
      .min(2, t("validation.displayName.minLength")),
    phone: Yup.string()
      .trim()
      .notRequired()
      .test("phone-format", t("validation.phone.invalid"), (value) => {
        if (!value) return true;
        return /^[+()\d\s-]+$/.test(value);
      }),
    email: Yup.string().trim().notRequired(),
    currentPassword: Yup.string()
      .test("current-required", t("validation.password.currentRequired"), (value, context) => {
        const { newPassword, confirmPassword } = context.parent as AccountFormValues;
        if (!newPassword && !confirmPassword) {
          return true;
        }
        return Boolean(value);
      }),
    newPassword: Yup.string()
      .test("new-required", t("validation.password.newRequired"), (value, context) => {
        const { currentPassword, confirmPassword } = context.parent as AccountFormValues;
        if (!currentPassword && !confirmPassword) {
          return true;
        }
        return Boolean(value);
      })
      .test("new-min", t("validation.password.minLength"), (value) => {
        if (!value) return true;
        return value.length >= 8;
      })
      .test("new-format", t("validation.password.letterNumber"), (value) => {
        if (!value) return true;
        return /^(?=.*[A-Za-z])(?=.*\d).+$/.test(value);
      }),
    confirmPassword: Yup.string()
      .test("confirm-required", t("validation.password.confirmRequired"), (value, context) => {
        const { newPassword } = context.parent as AccountFormValues;
        if (!newPassword) {
          return true;
        }
        return Boolean(value);
      })
      .test("confirm-match", t("validation.password.mismatch"), (value, context) => {
        const { newPassword } = context.parent as AccountFormValues;
        if (!newPassword) {
          return true;
        }
        return value === newPassword;
      }),
  });
