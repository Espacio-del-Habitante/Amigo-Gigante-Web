"use client";

import { Box, TextField } from "@mui/material";
import type { ChangeEvent } from "react";
import { useTranslations } from "next-intl";

import type { AdoptFormErrors, AdoptFormValues } from "./adoptFormTypes";

interface AdoptStepBasicProps {
  values: AdoptFormValues;
  errors: AdoptFormErrors;
  disabled?: boolean;
  onChange: (field: keyof AdoptFormValues, value: AdoptFormValues[keyof AdoptFormValues]) => void;
}

export function AdoptStepBasic({ values, errors, disabled = false, onChange }: AdoptStepBasicProps) {
  const t = useTranslations("adoptRequest");

  const handleChange = (field: keyof AdoptFormValues) => (event: ChangeEvent<HTMLInputElement>) => {
    onChange(field, event.target.value);
  };

  return (
    <Box className="grid grid-cols-1 gap-6 md:grid-cols-2">
      <TextField
        fullWidth
        required
        disabled={disabled}
        label={t("form.fields.fullName.label")}
        placeholder={t("form.fields.fullName.placeholder")}
        value={values.adopterDisplayName}
        onChange={handleChange("adopterDisplayName")}
        error={Boolean(errors.adopterDisplayName)}
        helperText={errors.adopterDisplayName}
        className="md:col-span-2"
      />

      <TextField
        fullWidth
        required
        disabled={disabled}
        type="email"
        label={t("form.fields.email.label")}
        placeholder={t("form.fields.email.placeholder")}
        value={values.adopterEmail}
        onChange={handleChange("adopterEmail")}
        error={Boolean(errors.adopterEmail)}
        helperText={errors.adopterEmail ?? t("form.fields.email.hint")}
      />

      <TextField
        fullWidth
        required
        disabled={disabled}
        label={t("form.fields.phone.label")}
        placeholder={t("form.fields.phone.placeholder")}
        value={values.adopterPhone}
        onChange={handleChange("adopterPhone")}
        error={Boolean(errors.adopterPhone)}
        helperText={errors.adopterPhone}
      />

      <TextField
        fullWidth
        required
        disabled={disabled}
        label={t("form.fields.city.label")}
        placeholder={t("form.fields.city.placeholder")}
        value={values.city}
        onChange={handleChange("city")}
        error={Boolean(errors.city)}
        helperText={errors.city}
      />

      <TextField
        fullWidth
        required
        disabled={disabled}
        label={t("form.fields.neighborhood.label")}
        placeholder={t("form.fields.neighborhood.placeholder")}
        value={values.neighborhood}
        onChange={handleChange("neighborhood")}
        error={Boolean(errors.neighborhood)}
        helperText={errors.neighborhood}
      />
    </Box>
  );
}
