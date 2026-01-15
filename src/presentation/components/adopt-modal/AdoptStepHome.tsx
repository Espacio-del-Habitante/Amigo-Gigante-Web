"use client";

import ApartmentRoundedIcon from "@mui/icons-material/ApartmentRounded";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import LocationCityRoundedIcon from "@mui/icons-material/LocationCityRounded";
import { alpha, Box, ButtonBase, Switch, TextField, Typography, useTheme } from "@mui/material";
import type { ChangeEvent } from "react";
import { useTranslations } from "next-intl";

import type { AdoptFormErrors, AdoptFormValues, HousingTypeOption } from "./adoptFormTypes";

interface AdoptStepHomeProps {
  values: AdoptFormValues;
  errors: AdoptFormErrors;
  disabled?: boolean;
  onChange: (field: keyof AdoptFormValues, value: AdoptFormValues[keyof AdoptFormValues]) => void;
}

const housingOptions = [
  { value: "house", icon: HomeRoundedIcon, labelKey: "form.fields.housingType.options.house" },
  { value: "apartment", icon: ApartmentRoundedIcon, labelKey: "form.fields.housingType.options.apartment" },
  { value: "other", icon: LocationCityRoundedIcon, labelKey: "form.fields.housingType.options.other" },
] as const satisfies ReadonlyArray<{
  value: Exclude<HousingTypeOption, "">;
  icon: typeof HomeRoundedIcon;
  labelKey: "form.fields.housingType.options.house" | "form.fields.housingType.options.apartment" | "form.fields.housingType.options.other";
}>;

export function AdoptStepHome({ values, errors, disabled = false, onChange }: AdoptStepHomeProps) {
  const t = useTranslations("adoptRequest");
  const theme = useTheme();

  const handleTextChange =
    (field: keyof AdoptFormValues) => (event: ChangeEvent<HTMLInputElement>) => {
      onChange(field, event.target.value);
    };

  return (
    <Box className="space-y-8">
      <Box>
        <Typography variant="subtitle1" sx={{ fontWeight: 800 }} className="mb-4">
          {t("form.fields.housingType.label")}
        </Typography>
        <Box className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {housingOptions.map((option) => {
            const Icon = option.icon;
            const isActive = values.housingType === option.value;
            return (
              <ButtonBase
                key={option.value}
                disabled={disabled}
                onClick={() => onChange("housingType", option.value)}
                className="flex w-full items-start gap-2 rounded-xl border border-neutral-200 bg-neutral-50 p-4 text-left transition-all"
                sx={{
                  borderColor: isActive ? theme.palette.primary.main : undefined,
                  boxShadow: isActive ? `0 0 0 3px ${alpha(theme.palette.primary.main, 0.18)}` : undefined,
                }}
              >
                <Icon className="text-brand-500" />
                <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
                  {t(option.labelKey)}
                </Typography>
              </ButtonBase>
            );
          })}
        </Box>
        {errors.housingType ? (
          <Typography variant="caption" color="error" className="mt-2 block font-semibold">
            {errors.housingType}
          </Typography>
        ) : null}
      </Box>

      <Box className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Box className="flex items-center justify-between rounded-xl border border-neutral-100 bg-neutral-50 p-4">
          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
              {t("form.fields.isRent.label")}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {t("form.fields.isRent.hint")}
            </Typography>
          </Box>
          <Switch
            disabled={disabled}
            checked={values.isRent}
            onChange={(event) => onChange("isRent", event.target.checked)}
          />
        </Box>

        <Box className="flex items-center justify-between rounded-xl border border-neutral-100 bg-neutral-50 p-4">
          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
              {t("form.fields.allowsPets.label")}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {t("form.fields.allowsPets.hint")}
            </Typography>
          </Box>
          <Switch
            disabled={disabled}
            checked={values.allowsPets}
            onChange={(event) => onChange("allowsPets", event.target.checked)}
          />
        </Box>
      </Box>

      <Box className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <TextField
          fullWidth
          disabled={disabled}
          label={t("form.fields.householdPeopleCount.label")}
          placeholder={t("form.fields.householdPeopleCount.placeholder")}
          type="number"
          value={values.householdPeopleCount}
          onChange={handleTextChange("householdPeopleCount")}
          error={Boolean(errors.householdPeopleCount)}
          helperText={errors.householdPeopleCount}
        />

        <TextField
          fullWidth
          disabled={disabled}
          label={t("form.fields.childrenAges.label")}
          placeholder={t("form.fields.childrenAges.placeholder")}
          value={values.childrenAges}
          onChange={handleTextChange("childrenAges")}
          error={Boolean(errors.childrenAges)}
          helperText={errors.childrenAges ?? t("form.fields.childrenAges.hint")}
        />
      </Box>
    </Box>
  );
}
