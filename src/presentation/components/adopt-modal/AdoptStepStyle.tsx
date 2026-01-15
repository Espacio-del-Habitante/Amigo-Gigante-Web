"use client";

import { Box, TextField } from "@mui/material";
import type { ChangeEvent } from "react";
import { useTranslations } from "next-intl";

import type { AdoptFormErrors, AdoptFormValues } from "./adoptFormTypes";

interface AdoptStepStyleProps {
  values: AdoptFormValues;
  errors: AdoptFormErrors;
  disabled?: boolean;
  onChange: (field: keyof AdoptFormValues, value: AdoptFormValues[keyof AdoptFormValues]) => void;
}

export function AdoptStepStyle({ values, errors, disabled = false, onChange }: AdoptStepStyleProps) {
  const t = useTranslations("adoptRequest");

  const handleTextChange =
    (field: keyof AdoptFormValues) => (event: ChangeEvent<HTMLInputElement>) => {
      onChange(field, event.target.value);
    };

  return (
    <Box className="grid grid-cols-1 gap-6 md:grid-cols-2">
      <TextField
        fullWidth
        disabled={disabled}
        multiline
        minRows={3}
        label={t("form.fields.otherPetsDescription.label")}
        placeholder={t("form.fields.otherPetsDescription.placeholder")}
        value={values.otherPetsDescription}
        onChange={handleTextChange("otherPetsDescription")}
        error={Boolean(errors.otherPetsDescription)}
        helperText={errors.otherPetsDescription}
        className="md:col-span-2"
      />

      <TextField
        fullWidth
        disabled={disabled}
        type="number"
        label={t("form.fields.hoursAlonePerDay.label")}
        placeholder={t("form.fields.hoursAlonePerDay.placeholder")}
        value={values.hoursAlonePerDay}
        onChange={handleTextChange("hoursAlonePerDay")}
        error={Boolean(errors.hoursAlonePerDay)}
        helperText={errors.hoursAlonePerDay ?? t("form.fields.hoursAlonePerDay.hint")}
      />

      <TextField
        fullWidth
        disabled={disabled}
        multiline
        minRows={3}
        label={t("form.fields.travelPlan.label")}
        placeholder={t("form.fields.travelPlan.placeholder")}
        value={values.travelPlan}
        onChange={handleTextChange("travelPlan")}
        error={Boolean(errors.travelPlan)}
        helperText={errors.travelPlan}
        className="md:col-span-2"
      />

      <TextField
        fullWidth
        disabled={disabled}
        multiline
        minRows={3}
        label={t("form.fields.experienceText.label")}
        placeholder={t("form.fields.experienceText.placeholder")}
        value={values.experienceText}
        onChange={handleTextChange("experienceText")}
        error={Boolean(errors.experienceText)}
        helperText={errors.experienceText}
        className="md:col-span-2"
      />

      <TextField
        fullWidth
        disabled={disabled}
        multiline
        minRows={3}
        label={t("form.fields.motivationText.label")}
        placeholder={t("form.fields.motivationText.placeholder")}
        value={values.motivationText}
        onChange={handleTextChange("motivationText")}
        error={Boolean(errors.motivationText)}
        helperText={errors.motivationText}
        className="md:col-span-2"
      />
    </Box>
  );
}
