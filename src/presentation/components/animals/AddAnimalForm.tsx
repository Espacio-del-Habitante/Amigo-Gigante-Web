"use client";

import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import LocationOnRoundedIcon from "@mui/icons-material/LocationOnRounded";
import PublishRoundedIcon from "@mui/icons-material/PublishRounded";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
import UploadFileRoundedIcon from "@mui/icons-material/UploadFileRounded";
import {
  Alert,
  alpha,
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Divider,
  FormControlLabel,
  IconButton,
  InputAdornment,
  MenuItem,
  Stack,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { useFormik } from "formik";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useMemo, useRef, useState } from "react";

import type { AnimalManagementSex } from "@/domain/models/AnimalManagement";
import { CreateAnimalUseCase } from "@/domain/usecases/animals/CreateAnimalUseCase";
import { appContainer } from "@/infrastructure/ioc/container";
import { USE_CASE_TYPES } from "@/infrastructure/ioc/usecases/usecases.types";
import {
  createAddAnimalValidationSchema,
  type AddAnimalFormValues,
  type AddAnimalSubmissionType,
} from "@/presentation/components/animals/addAnimalValidation";

const MAX_PHOTOS = 10;
const MAX_SIZE_BYTES = 5 * 1024 * 1024;
const ALLOWED_MIME_TYPES = new Set(["image/svg+xml", "image/png", "image/jpeg", "image/gif"]);

function hasAllowedExtension(fileName: string): boolean {
  const lower = fileName.toLowerCase();
  return lower.endsWith(".svg") || lower.endsWith(".png") || lower.endsWith(".jpg") || lower.endsWith(".jpeg") || lower.endsWith(".gif");
}

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result ?? ""));
    reader.onerror = () => reject(new Error("read_failed"));
    reader.readAsDataURL(file);
  });
}

export function AddAnimalForm() {
  const theme = useTheme();
  const t = useTranslations("animals");
  const locale = useLocale();
  const router = useRouter();
  const createAnimalUseCase = useMemo(
    () => appContainer.get<CreateAnimalUseCase>(USE_CASE_TYPES.CreateAnimalUseCase),
    [],
  );

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [mediaError, setMediaError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isReadingFiles, setIsReadingFiles] = useState(false);
  const [isDragActive, setIsDragActive] = useState(false);

  const validationSchema = useMemo(() => createAddAnimalValidationSchema(t), [t]);

  const formik = useFormik<AddAnimalFormValues>({
    initialValues: {
      name: "",
      breed: "",
      species: "",
      age: "",
      ageUnit: "years",
      gender: "unknown",
      size: "unknown",
      currentLocation: "",
      description: "",
      status: "",
      healthStatus: {
        vaccinated: false,
        spayedNeutered: false,
        wormed: false,
      },
      photos: [],
      submissionType: "draft",
    },
    validationSchema,
    validateOnChange: false,
    validateOnBlur: true,
    onSubmit: async (values, helpers) => {
      setSubmitError(null);

      try {
        const isPublished = values.submissionType === "publish";
        const species = values.species;
        const status = values.status;
        if (!species || !status) {
          throw new Error("add.errors.generic");
        }

        const sex = values.gender as AnimalManagementSex;
        const breed = values.breed.trim() || null;
        const description = values.description.trim();

        await createAnimalUseCase.execute({
          name: values.name.trim(),
          species,
          breed,
          sex,
          age: typeof values.age === "number" ? values.age : Number(values.age),
          ageUnit: values.ageUnit,
          size: values.size === "unknown" ? "unknown" : values.size,
          status,
          description,
          photoUrls: values.photos,
          isPublished,
        });

        const createdParam = isPublished ? "published" : "draft";
        const next = `/${locale}/foundations/animals?created=${createdParam}`;
        router.push(next);
      } catch (error) {
        if (error instanceof Error && error.message) {
          const candidate = error.message;
          if (candidate.startsWith("errors.") || candidate.startsWith("add.")) {
            setSubmitError(t(candidate));
          } else {
            setSubmitError(candidate);
          }
        } else {
          setSubmitError(t("add.errors.generic"));
        }
      } finally {
        helpers.setSubmitting(false);
      }
    },
  });

  const fieldError = <TKey extends keyof AddAnimalFormValues>(field: TKey) => {
    if (formik.touched[field] || formik.submitCount > 0) {
      return formik.errors[field] as string | undefined;
    }
    return undefined;
  };

  const descriptionCount = formik.values.description.length;

  const canInteract = !(formik.isSubmitting || isReadingFiles);

  const handleAddFiles = async (files: File[]) => {
    if (files.length === 0) return;

    setMediaError(null);

    const currentCount = formik.values.photos.length;
    if (currentCount >= MAX_PHOTOS) {
      setMediaError(t("add.media.errors.tooMany"));
      return;
    }

    const nextFiles = files.slice(0, Math.max(0, MAX_PHOTOS - currentCount));
    if (nextFiles.length < files.length) {
      setMediaError(t("add.media.errors.tooMany"));
    }

    setIsReadingFiles(true);
    try {
      const nextDataUrls: string[] = [];

      for (const file of nextFiles) {
        const mimeOk = ALLOWED_MIME_TYPES.has(file.type);
        const extOk = hasAllowedExtension(file.name);
        if (!mimeOk && !extOk) {
          setMediaError(t("add.media.errors.invalidType"));
          continue;
        }

        if (file.size > MAX_SIZE_BYTES) {
          setMediaError(t("add.media.errors.tooLarge"));
          continue;
        }

        try {
          const dataUrl = await fileToDataUrl(file);
          nextDataUrls.push(dataUrl);
        } catch {
          setMediaError(t("add.media.errors.readFailed"));
        }
      }

      if (nextDataUrls.length > 0) {
        await formik.setFieldValue("photos", [...formik.values.photos, ...nextDataUrls], true);
      }
    } finally {
      setIsReadingFiles(false);
    }
  };

  const handlePickFiles = () => {
    fileInputRef.current?.click();
  };

  const handleDrop: React.DragEventHandler<HTMLDivElement> = async (event) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragActive(false);
    if (!canInteract) return;
    const files = Array.from(event.dataTransfer.files ?? []);
    await handleAddFiles(files);
  };

  return (
    <Box
      component="form"
      noValidate
      onSubmit={formik.handleSubmit}
      className="flex flex-col gap-8"
    >
      {mediaError ? (
        <Alert severity="error" onClose={() => setMediaError(null)}>
          {mediaError}
        </Alert>
      ) : null}

      {submitError ? (
        <Alert severity="error" onClose={() => setSubmitError(null)}>
          {submitError}
        </Alert>
      ) : null}

      <Box className="rounded-xl border border-neutral-200 bg-white p-6">
        <Stack spacing={2}>
          <Typography variant="h6" sx={{ fontWeight: 900 }}>
            {t("add.sections.basics.title")}
          </Typography>

          <Box className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <TextField
              fullWidth
              required
              disabled={!canInteract}
              {...formik.getFieldProps("name")}
              label={t("add.fields.name.label")}
              placeholder={t("add.fields.name.placeholder")}
              error={Boolean(fieldError("name"))}
              helperText={fieldError("name")}
              className="md:col-span-2"
            />

            <TextField
              fullWidth
              disabled={!canInteract}
              {...formik.getFieldProps("breed")}
              label={t("add.fields.breed.label")}
              placeholder={t("add.fields.breed.placeholder")}
              error={Boolean(fieldError("breed"))}
              helperText={fieldError("breed") ?? t("add.fields.breed.hint")}
            />

            <TextField
              fullWidth
              required
              select
              disabled={!canInteract}
              {...formik.getFieldProps("species")}
              label={t("add.fields.species.label")}
              error={Boolean(fieldError("species"))}
              helperText={fieldError("species")}
            >
              <MenuItem value="" disabled>
                {t("add.fields.species.placeholder")}
              </MenuItem>
              <MenuItem value="dog">{t("add.fields.species.options.dog")}</MenuItem>
              <MenuItem value="cat">{t("add.fields.species.options.cat")}</MenuItem>
              <MenuItem value="bird">{t("add.fields.species.options.bird")}</MenuItem>
              <MenuItem value="other">{t("add.fields.species.options.other")}</MenuItem>
            </TextField>

            <TextField
              fullWidth
              required
              disabled={!canInteract}
              {...formik.getFieldProps("age")}
              type="number"
              label={t("add.fields.age.label")}
              placeholder={t("add.fields.age.placeholder")}
              error={Boolean(fieldError("age"))}
              helperText={fieldError("age")}
            />

            <TextField
              fullWidth
              required
              select
              disabled={!canInteract}
              {...formik.getFieldProps("ageUnit")}
              label={t("add.fields.ageUnit.label")}
              error={Boolean(fieldError("ageUnit"))}
              helperText={fieldError("ageUnit")}
            >
              <MenuItem value="years">{t("add.fields.ageUnit.options.years")}</MenuItem>
              <MenuItem value="months">{t("add.fields.ageUnit.options.months")}</MenuItem>
            </TextField>

            <TextField
              fullWidth
              required
              select
              disabled={!canInteract}
              {...formik.getFieldProps("gender")}
              label={t("add.fields.gender.label")}
              error={Boolean(fieldError("gender"))}
              helperText={fieldError("gender")}
            >
              <MenuItem value="unknown" disabled>
                {t("add.fields.gender.placeholder")}
              </MenuItem>
              <MenuItem value="male">{t("add.fields.gender.options.male")}</MenuItem>
              <MenuItem value="female">{t("add.fields.gender.options.female")}</MenuItem>
            </TextField>

            <TextField
              fullWidth
              select
              disabled={!canInteract}
              {...formik.getFieldProps("size")}
              label={t("add.fields.size.label")}
              error={Boolean(fieldError("size"))}
              helperText={fieldError("size")}
            >
              <MenuItem value="unknown" disabled>
                {t("add.fields.size.placeholder")}
              </MenuItem>
              <MenuItem value="small">{t("add.fields.size.options.small")}</MenuItem>
              <MenuItem value="medium">{t("add.fields.size.options.medium")}</MenuItem>
              <MenuItem value="large">{t("add.fields.size.options.large")}</MenuItem>
              <MenuItem value="giant">{t("add.fields.size.options.giant")}</MenuItem>
            </TextField>

            <TextField
              fullWidth
              disabled={!canInteract}
              {...formik.getFieldProps("currentLocation")}
              label={t("add.fields.currentLocation.label")}
              placeholder={t("add.fields.currentLocation.placeholder")}
              error={Boolean(fieldError("currentLocation"))}
              helperText={fieldError("currentLocation")}
              className="md:col-span-2"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LocationOnRoundedIcon className="text-neutral-400" />
                  </InputAdornment>
                ),
              }}
            />
          </Box>
        </Stack>
      </Box>

      <Box className="rounded-xl border border-neutral-200 bg-white p-6">
        <Stack spacing={2}>
          <Box className="flex flex-col gap-1">
            <Typography variant="h6" sx={{ fontWeight: 900 }}>
              {t("add.sections.media.title")}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {t("add.sections.media.subtitle")}
            </Typography>
          </Box>

          <input
            ref={fileInputRef}
            type="file"
            accept=".svg,.png,.jpg,.jpeg,.gif,image/svg+xml,image/png,image/jpeg,image/gif"
            multiple
            className="hidden"
            disabled={!canInteract}
            onChange={async (event) => {
              const files = Array.from(event.target.files ?? []);
              event.target.value = "";
              await handleAddFiles(files);
            }}
          />

          <Box
            role="button"
            tabIndex={0}
            onClick={() => {
              if (!canInteract) return;
              handlePickFiles();
            }}
            onKeyDown={(event) => {
              if (!canInteract) return;
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                handlePickFiles();
              }
            }}
            onDragEnter={(event) => {
              event.preventDefault();
              if (!canInteract) return;
              setIsDragActive(true);
            }}
            onDragLeave={(event) => {
              event.preventDefault();
              setIsDragActive(false);
            }}
            onDragOver={(event) => {
              event.preventDefault();
              if (!canInteract) return;
            }}
            onDrop={handleDrop}
            sx={{
              borderRadius: 2,
              border: "2px dashed",
              borderColor: isDragActive ? theme.palette.primary.main : theme.palette.divider,
              backgroundColor: isDragActive ? alpha(theme.palette.primary.main, 0.06) : "transparent",
              transition: "all 120ms ease",
              px: 3,
              py: 4,
              cursor: canInteract ? "pointer" : "not-allowed",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 2,
              flexWrap: "wrap",
            }}
            aria-label={t("add.media.upload.ariaLabel")}
          >
            <Box className="flex items-start gap-3">
              <Box
                className="flex h-10 w-10 items-center justify-center rounded-lg"
                sx={{
                  backgroundColor: alpha(theme.palette.primary.main, 0.1),
                  color: theme.palette.primary.main,
                }}
              >
                {isReadingFiles ? <CircularProgress size={18} /> : <UploadFileRoundedIcon />}
              </Box>
              <Box className="flex flex-col">
                <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
                  {t("add.media.upload.title")}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {t("add.media.upload.hint")}
                </Typography>
              </Box>
            </Box>

            <Typography variant="caption" color="text.secondary" className="font-semibold">
              {t("add.media.upload.limit")}
            </Typography>
          </Box>

          {Boolean(fieldError("photos")) ? (
            <Typography variant="caption" color="error" className="font-semibold">
              {fieldError("photos")}
            </Typography>
          ) : null}

          <Box className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {formik.values.photos.map((src, index) => (
              <Box
                key={`${src.slice(0, 24)}-${index}`}
                className="relative overflow-hidden rounded-xl border border-neutral-200 bg-neutral-50"
                sx={{ aspectRatio: "1 / 1" }}
              >
                <img src={src} alt={t("add.media.preview.alt", { index: index + 1 })} className="h-full w-full object-cover" />
                <IconButton
                  aria-label={t("add.media.preview.remove", { index: index + 1 })}
                  size="small"
                  disabled={!canInteract}
                  onClick={() => {
                    const next = formik.values.photos.filter((_, idx) => idx !== index);
                    void formik.setFieldValue("photos", next, true);
                  }}
                  sx={{
                    position: "absolute",
                    top: 8,
                    right: 8,
                    backgroundColor: alpha(theme.palette.common.black, 0.5),
                    color: theme.palette.common.white,
                    "&:hover": {
                      backgroundColor: alpha(theme.palette.common.black, 0.65),
                    },
                  }}
                >
                  <DeleteRoundedIcon fontSize="small" />
                </IconButton>
              </Box>
            ))}
          </Box>
        </Stack>
      </Box>

      <Box className="rounded-xl border border-neutral-200 bg-white p-6">
        <Stack spacing={2}>
          <Typography variant="h6" sx={{ fontWeight: 900 }}>
            {t("add.sections.story.title")}
          </Typography>

          <TextField
            fullWidth
            required
            multiline
            minRows={5}
            disabled={!canInteract}
            {...formik.getFieldProps("description")}
            label={t("add.fields.description.label")}
            placeholder={t("add.fields.description.placeholder")}
            error={Boolean(fieldError("description"))}
            helperText={fieldError("description")}
          />

          <Typography variant="caption" className="text-right text-neutral-500">
            {t("add.fields.description.counter", { count: descriptionCount })}
          </Typography>

          <TextField
            fullWidth
            required
            select
            disabled={!canInteract}
            {...formik.getFieldProps("status")}
            label={t("add.fields.status.label")}
            error={Boolean(fieldError("status"))}
            helperText={fieldError("status")}
          >
            <MenuItem value="" disabled>
              {t("add.fields.status.placeholder")}
            </MenuItem>
            <MenuItem value="available">{t("add.fields.status.options.available")}</MenuItem>
            <MenuItem value="inactive">{t("add.fields.status.options.inactive")}</MenuItem>
            <MenuItem value="in_treatment">{t("add.fields.status.options.inTreatment")}</MenuItem>
            <MenuItem value="pending">{t("add.fields.status.options.pending")}</MenuItem>
          </TextField>

          <div className="flex items-center gap-3">
            <Divider className="flex-1" />
            <Typography variant="subtitle2" className="text-neutral-500">
              {t("add.fields.healthStatus.label")}
            </Typography>
            <Divider className="flex-1" />
          </div>

          <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={formik.values.healthStatus.vaccinated}
                  onChange={(event) => formik.setFieldValue("healthStatus.vaccinated", event.target.checked)}
                  disabled={!canInteract}
                />
              }
              label={t("add.fields.healthStatus.vaccinated")}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={formik.values.healthStatus.spayedNeutered}
                  onChange={(event) => formik.setFieldValue("healthStatus.spayedNeutered", event.target.checked)}
                  disabled={!canInteract}
                />
              }
              label={t("add.fields.healthStatus.spayedNeutered")}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={formik.values.healthStatus.wormed}
                  onChange={(event) => formik.setFieldValue("healthStatus.wormed", event.target.checked)}
                  disabled={!canInteract}
                />
              }
              label={t("add.fields.healthStatus.wormed")}
            />
          </Stack>
        </Stack>
      </Box>

      <Box className="flex flex-col gap-3 sm:flex-row sm:justify-end">
        <Button
          type="button"
          variant="outlined"
          disabled={!canInteract}
          startIcon={<SaveRoundedIcon />}
          onClick={async () => {
            await formik.setFieldValue("submissionType", "draft" satisfies AddAnimalSubmissionType, false);
            await formik.submitForm();
          }}
          className="w-full sm:w-auto"
        >
          {t("add.actions.saveDraft")}
        </Button>

        <Button
          type="button"
          variant="contained"
          disabled={!canInteract}
          startIcon={
            formik.isSubmitting ? <CircularProgress size={18} color="inherit" /> : <PublishRoundedIcon />
          }
          onClick={async () => {
            await formik.setFieldValue("submissionType", "publish" satisfies AddAnimalSubmissionType, false);
            await formik.submitForm();
          }}
          className="w-full sm:w-auto"
        >
          {t("add.actions.publish")}
        </Button>
      </Box>
    </Box>
  );
}

