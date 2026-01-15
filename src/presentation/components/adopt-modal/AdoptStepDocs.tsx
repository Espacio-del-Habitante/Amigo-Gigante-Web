"use client";

import AddAPhotoRoundedIcon from "@mui/icons-material/AddAPhotoRounded";
import BadgeRoundedIcon from "@mui/icons-material/BadgeRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import {
  Box,
  ButtonBase,
  Checkbox,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import { useTranslations } from "next-intl";
import { useRef } from "react";

import type { AdoptFormErrors, AdoptFormValues } from "./adoptFormTypes";

interface AdoptStepDocsProps {
  values: AdoptFormValues;
  errors: AdoptFormErrors;
  disabled?: boolean;
  onIdDocumentChange: (file: File | null) => void;
  onAddHomePhotos: (files: File[]) => void;
  onRemoveHomePhoto: (index: number) => void;
  onToggle: (field: "acceptsVetCosts" | "acceptsLifetimeCommitment", value: boolean) => void;
}

export function AdoptStepDocs({
  values,
  errors,
  disabled = false,
  onIdDocumentChange,
  onAddHomePhotos,
  onRemoveHomePhoto,
  onToggle,
}: AdoptStepDocsProps) {
  const t = useTranslations("adoptRequest");
  const idInputRef = useRef<HTMLInputElement | null>(null);
  const homeInputRef = useRef<HTMLInputElement | null>(null);

  return (
    <Box className="space-y-8">
      <Box className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Box>
          <Typography variant="subtitle2" sx={{ fontWeight: 800 }} className="mb-3">
            {t("form.docs.idDocument.label")}
          </Typography>
          <input
            ref={idInputRef}
            type="file"
            accept=".pdf,.png,.jpg,.jpeg,application/pdf,image/png,image/jpeg"
            className="hidden"
            disabled={disabled}
            onChange={(event) => {
              const file = event.target.files?.[0] ?? null;
              onIdDocumentChange(file);
              event.target.value = "";
            }}
          />
          <ButtonBase
            disabled={disabled}
            onClick={() => idInputRef.current?.click()}
            className="flex w-full flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-neutral-200 bg-neutral-50 px-4 py-6 text-center transition-all hover:border-brand-300"
          >
            <BadgeRoundedIcon className="text-brand-500" />
            <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
              {t("form.docs.idDocument.action")}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {t("form.docs.idDocument.hint")}
            </Typography>
          </ButtonBase>
          {values.idDocument ? (
            <Typography variant="caption" color="text.secondary" className="mt-2 block">
              {t("form.docs.idDocument.selected", { name: values.idDocument.name })}
            </Typography>
          ) : null}
          {errors.idDocument ? (
            <Typography variant="caption" color="error" className="mt-2 block font-semibold">
              {errors.idDocument}
            </Typography>
          ) : null}
        </Box>

        <Box>
          <Typography variant="subtitle2" sx={{ fontWeight: 800 }} className="mb-3">
            {t("form.docs.homePhotos.label")}
          </Typography>
          <input
            ref={homeInputRef}
            type="file"
            accept=".png,.jpg,.jpeg,image/png,image/jpeg"
            multiple
            className="hidden"
            disabled={disabled}
            onChange={(event) => {
              const files = Array.from(event.target.files ?? []);
              onAddHomePhotos(files);
              event.target.value = "";
            }}
          />
          <ButtonBase
            disabled={disabled}
            onClick={() => homeInputRef.current?.click()}
            className="flex w-full flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-neutral-200 bg-neutral-50 px-4 py-6 text-center transition-all hover:border-brand-300"
          >
            <AddAPhotoRoundedIcon className="text-brand-500" />
            <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
              {t("form.docs.homePhotos.action")}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {t("form.docs.homePhotos.hint")}
            </Typography>
          </ButtonBase>
          {errors.homePhotos ? (
            <Typography variant="caption" color="error" className="mt-2 block font-semibold">
              {errors.homePhotos}
            </Typography>
          ) : null}
        </Box>
      </Box>

      {values.homePhotos.length > 0 ? (
        <Stack spacing={1.5}>
          <Typography variant="caption" color="text.secondary">
            {t("form.docs.homePhotos.selectedCount", { count: values.homePhotos.length })}
          </Typography>
          <Stack spacing={1}>
            {values.homePhotos.map((file, index) => (
              <Box
                key={`${file.name}-${index}`}
                className="flex items-center justify-between rounded-xl border border-neutral-100 bg-neutral-50 px-3 py-2"
              >
                <Typography variant="caption" color="text.secondary">
                  {file.name}
                </Typography>
                <IconButton
                  aria-label={t("form.docs.homePhotos.remove", { index: index + 1 })}
                  size="small"
                  disabled={disabled}
                  onClick={() => onRemoveHomePhoto(index)}
                >
                  <CloseRoundedIcon fontSize="small" />
                </IconButton>
              </Box>
            ))}
          </Stack>
        </Stack>
      ) : null}

      <Box className="space-y-4 border-t border-neutral-100 pt-4">
        <Box className="flex items-start gap-3">
          <Checkbox
            checked={values.acceptsVetCosts}
            onChange={(event) => onToggle("acceptsVetCosts", event.target.checked)}
            disabled={disabled}
          />
          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
              {t("form.consents.vetCosts.title")}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {t("form.consents.vetCosts.description")}
            </Typography>
          </Box>
        </Box>
        {errors.acceptsVetCosts ? (
          <Typography variant="caption" color="error" className="-mt-2 block pl-10 font-semibold">
            {errors.acceptsVetCosts}
          </Typography>
        ) : null}
        <Box className="flex items-start gap-3">
          <Checkbox
            checked={values.acceptsLifetimeCommitment}
            onChange={(event) => onToggle("acceptsLifetimeCommitment", event.target.checked)}
            disabled={disabled}
          />
          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
              {t("form.consents.lifetimeCommitment.title")}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {t("form.consents.lifetimeCommitment.description")}
            </Typography>
          </Box>
        </Box>
        {errors.acceptsLifetimeCommitment ? (
          <Typography variant="caption" color="error" className="-mt-2 block pl-10 font-semibold">
            {errors.acceptsLifetimeCommitment}
          </Typography>
        ) : null}
      </Box>
    </Box>
  );
}
