import { TextField, Typography } from "@mui/material";
import type { FormikProps } from "formik";
import type { useTranslations } from "next-intl";

import type { AccountFormValues } from "@/presentation/components/account/accountValidation";

interface AccountSecurityProps {
  t: ReturnType<typeof useTranslations>;
  formik: FormikProps<AccountFormValues>;
  isLoading: boolean;
}

export function AccountSecurity({ t, formik, isLoading }: AccountSecurityProps) {
  const currentPasswordError = formik.touched.currentPassword
    ? formik.errors.currentPassword
    : undefined;
  const newPasswordError = formik.touched.newPassword ? formik.errors.newPassword : undefined;
  const confirmPasswordError = formik.touched.confirmPassword
    ? formik.errors.confirmPassword
    : undefined;

  return (
    <section className="rounded-xl border border-neutral-200 bg-white p-6">
      <div className="mb-6 flex items-center gap-2">
        <span className="material-symbols-outlined text-brand-500">security</span>
        <Typography variant="h6" className="font-bold text-neutral-900">
          {t("sections.security")}
        </Typography>
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <TextField
          {...formik.getFieldProps("currentPassword")}
          type="password"
          fullWidth
          label={t("fields.currentPassword.label")}
          placeholder={t("fields.currentPassword.placeholder")}
          disabled={formik.isSubmitting || isLoading}
          error={Boolean(currentPasswordError)}
          helperText={currentPasswordError}
        />
        <TextField
          {...formik.getFieldProps("newPassword")}
          type="password"
          fullWidth
          label={t("fields.newPassword.label")}
          placeholder={t("fields.newPassword.placeholder")}
          disabled={formik.isSubmitting || isLoading}
          error={Boolean(newPasswordError)}
          helperText={newPasswordError}
        />
        <TextField
          {...formik.getFieldProps("confirmPassword")}
          type="password"
          fullWidth
          label={t("fields.confirmPassword.label")}
          placeholder={t("fields.confirmPassword.placeholder")}
          disabled={formik.isSubmitting || isLoading}
          error={Boolean(confirmPasswordError)}
          helperText={confirmPasswordError}
        />
      </div>
      <Typography variant="caption" className="mt-4 text-neutral-500">
        {t("security.hint")}
      </Typography>
    </section>
  );
}
