import { TextField, Typography } from "@mui/material";
import type { FormikProps } from "formik";
import type { useTranslations } from "next-intl";

import type { AccountFormValues } from "@/presentation/components/account/accountValidation";

interface AccountPersonalInfoProps {
  t: ReturnType<typeof useTranslations>;
  formik: FormikProps<AccountFormValues>;
  isLoading: boolean;
}

export function AccountPersonalInfo({ t, formik, isLoading }: AccountPersonalInfoProps) {
  const displayNameError = formik.touched.displayName ? formik.errors.displayName : undefined;
  const phoneError = formik.touched.phone ? formik.errors.phone : undefined;

  return (
    <section className="rounded-xl border border-neutral-200 bg-white p-6">
      <div className="mb-6 flex items-center gap-2">
        <span className="material-symbols-outlined text-brand-500">badge</span>
        <Typography variant="h6" className="font-bold text-neutral-900">
          {t("sections.personalInfo")}
        </Typography>
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <TextField
          {...formik.getFieldProps("displayName")}
          fullWidth
          label={t("fields.fullName.label")}
          placeholder={t("fields.fullName.placeholder")}
          disabled={formik.isSubmitting || isLoading}
          error={Boolean(displayNameError)}
          helperText={displayNameError}
        />
        <TextField
          {...formik.getFieldProps("phone")}
          fullWidth
          label={t("fields.phone.label")}
          placeholder={t("fields.phone.placeholder")}
          disabled={formik.isSubmitting || isLoading}
          error={Boolean(phoneError)}
          helperText={phoneError}
        />
        <TextField
          {...formik.getFieldProps("email")}
          fullWidth
          label={t("fields.email.label")}
          placeholder={t("fields.email.placeholder")}
          disabled
          helperText={t("fields.email.hint")}
        />
      </div>
    </section>
  );
}
