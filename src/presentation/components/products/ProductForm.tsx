"use client";

import AddPhotoAlternateRoundedIcon from "@mui/icons-material/AddPhotoAlternateRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
import {
  Alert,
  alpha,
  Box,
  Button,
  CircularProgress,
  FormControlLabel,
  IconButton,
  InputAdornment,
  Switch,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import type { FormikHelpers } from "formik";
import { useFormik } from "formik";
import { useTranslations } from "next-intl";
import { useMemo, useRef, useState } from "react";

import { createProductFormValidationSchema, type ProductFormValues } from "./productFormValidation";

const MAX_SIZE_BYTES = 5 * 1024 * 1024;
const ALLOWED_MIME_TYPES = new Set(["image/svg+xml", "image/png", "image/jpeg"]);

function hasAllowedExtension(fileName: string): boolean {
  const lower = fileName.toLowerCase();
  return lower.endsWith(".svg") || lower.endsWith(".png") || lower.endsWith(".jpg") || lower.endsWith(".jpeg");
}

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result ?? ""));
    reader.onerror = () => reject(new Error("read_failed"));
    reader.readAsDataURL(file);
  });
}

function formatFileSize(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes <= 0) return "0 KB";
  const kb = bytes / 1024;
  if (kb < 1024) return `${Math.round(kb)} KB`;
  return `${(kb / 1024).toFixed(1)} MB`;
}

export interface ProductFormProps {
  initialValues: ProductFormValues;
  onSubmit: (values: ProductFormValues, helpers: FormikHelpers<ProductFormValues>) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
  loadError?: string | null;
  submitError?: string | null;
  loadingLabel?: string;
}

export function ProductForm({
  initialValues,
  onSubmit,
  onCancel,
  isLoading = false,
  loadError = null,
  submitError = null,
  loadingLabel,
}: ProductFormProps) {
  const theme = useTheme();
  const t = useTranslations("productForm");
  const validationSchema = useMemo(() => createProductFormValidationSchema(t), [t]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [mediaError, setMediaError] = useState<string | null>(null);
  const [isReadingFiles, setIsReadingFiles] = useState(false);
  const [isDragActive, setIsDragActive] = useState(false);
  const [imageMeta, setImageMeta] = useState<{ name: string; size: string } | null>(null);

  const formik = useFormik<ProductFormValues>({
    initialValues,
    validationSchema,
    validateOnChange: false,
    validateOnBlur: true,
    enableReinitialize: true,
    onSubmit,
  });

  const canInteract = !(formik.isSubmitting || isReadingFiles || isLoading || Boolean(loadError));

  const fieldError = <TKey extends keyof ProductFormValues>(field: TKey) => {
    if (formik.touched[field] || formik.submitCount > 0) {
      return formik.errors[field] as string | undefined;
    }
    return undefined;
  };

  const handleAddFile = async (file: File) => {
    setMediaError(null);

    const mimeOk = ALLOWED_MIME_TYPES.has(file.type);
    const extOk = hasAllowedExtension(file.name);
    if (!mimeOk && !extOk) {
      setMediaError(t("form.media.errors.invalidType"));
      return;
    }

    if (file.size > MAX_SIZE_BYTES) {
      setMediaError(t("form.media.errors.tooLarge"));
      return;
    }

    setIsReadingFiles(true);
    try {
      const dataUrl = await fileToDataUrl(file);
      await formik.setFieldValue("imageUrl", dataUrl, true);
      setImageMeta({ name: file.name, size: formatFileSize(file.size) });
    } catch {
      setMediaError(t("form.media.errors.readFailed"));
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
    const [file] = Array.from(event.dataTransfer.files ?? []);
    if (file) {
      await handleAddFile(file);
    }
  };

  return (
    <Box component="form" noValidate onSubmit={formik.handleSubmit} className="flex flex-col gap-8">
      {isLoading ? (
        <Box className="flex items-center gap-3 text-neutral-600">
          <CircularProgress size={20} />
          <Typography variant="body2">{loadingLabel ?? t("edit.status.loading")}</Typography>
        </Box>
      ) : null}

      {loadError ? <Alert severity="error">{loadError}</Alert> : null}

      {mediaError ? (
        <Alert severity="error" onClose={() => setMediaError(null)}>
          {mediaError}
        </Alert>
      ) : null}

      {submitError ? <Alert severity="error">{submitError}</Alert> : null}

      <Box className="rounded-xl border border-neutral-200 bg-white p-6">
        <Box className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <Box className="flex flex-col gap-6 lg:col-span-2">
            <Typography variant="h6" sx={{ fontWeight: 900 }}>
              {t("form.sections.general.title")}
            </Typography>

            <Box className="flex flex-col gap-4">
              <TextField
                fullWidth
                required
                disabled={!canInteract}
                {...formik.getFieldProps("name")}
                label={t("form.fields.name.label")}
                placeholder={t("form.fields.name.placeholder")}
                error={Boolean(fieldError("name"))}
                helperText={fieldError("name")}
              />

              <TextField
                fullWidth
                disabled={!canInteract}
                {...formik.getFieldProps("price")}
                label={t("form.fields.price.label")}
                placeholder={t("form.fields.price.placeholder")}
                error={Boolean(fieldError("price"))}
                helperText={fieldError("price")}
                type="number"
                inputProps={{ min: 0, step: "0.01" }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Typography variant="subtitle2" color="text.secondary">
                        $
                      </Typography>
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                fullWidth
                multiline
                minRows={5}
                disabled={!canInteract}
                {...formik.getFieldProps("description")}
                label={t("form.fields.description.label")}
                placeholder={t("form.fields.description.placeholder")}
                error={Boolean(fieldError("description"))}
                helperText={fieldError("description")}
              />
            </Box>
          </Box>

          <Box className="flex flex-col gap-6">
            <Box className="flex flex-col gap-2">
              <Typography variant="h6" sx={{ fontWeight: 900 }}>
                {t("form.sections.image.title")}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {t("form.sections.image.hint")}
              </Typography>
            </Box>

            <input
              ref={fileInputRef}
              type="file"
              accept=".svg,.png,.jpg,.jpeg,image/svg+xml,image/png,image/jpeg"
              className="hidden"
              disabled={!canInteract}
              onChange={async (event) => {
                const [file] = Array.from(event.target.files ?? []);
                event.target.value = "";
                if (file) {
                  await handleAddFile(file);
                }
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
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 1,
                textAlign: "center",
              }}
              aria-label={t("form.media.upload.ariaLabel")}
            >
              <Box
                className="flex h-12 w-12 items-center justify-center rounded-lg"
                sx={{
                  backgroundColor: alpha(theme.palette.primary.main, 0.1),
                  color: theme.palette.primary.main,
                }}
              >
                {isReadingFiles ? <CircularProgress size={20} /> : <AddPhotoAlternateRoundedIcon />}
              </Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
                {t("form.media.upload.title")}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {t("form.media.upload.hint")}
              </Typography>
              <Typography variant="caption" color="text.secondary" className="font-semibold">
                {t("form.media.upload.limit")}
              </Typography>
            </Box>

            <TextField
              fullWidth
              disabled={!canInteract}
              value={formik.values.imageUrl}
              onBlur={formik.getFieldProps("imageUrl").onBlur}
              onChange={(event) => {
                setMediaError(null);
                setImageMeta(null);
                void formik.setFieldValue("imageUrl", event.target.value, true);
              }}
              label={t("form.fields.imageUrl.label")}
              placeholder={t("form.fields.imageUrl.placeholder")}
              error={Boolean(fieldError("imageUrl"))}
              helperText={fieldError("imageUrl")}
            />

            {formik.values.imageUrl ? (
              <Box className="flex items-center gap-3 rounded-lg bg-neutral-100 p-3">
                <Box
                  component="img"
                  src={formik.values.imageUrl}
                  alt={t("form.media.preview.alt")}
                  className="h-12 w-12 rounded-lg object-cover"
                />
                <Box className="min-w-0 flex-1">
                  <Typography variant="caption" sx={{ fontWeight: 700 }} noWrap>
                    {imageMeta?.name ?? t("form.media.preview.current")}
                  </Typography>
                  {imageMeta?.size ? (
                    <Typography variant="caption" color="text.secondary">
                      {t("form.media.preview.size", { size: imageMeta.size })}
                    </Typography>
                  ) : null}
                </Box>
                <IconButton
                  aria-label={t("form.media.preview.remove")}
                  size="small"
                  disabled={!canInteract}
                  onClick={() => {
                    setImageMeta(null);
                    void formik.setFieldValue("imageUrl", "", true);
                  }}
                >
                  <DeleteRoundedIcon fontSize="small" />
                </IconButton>
              </Box>
            ) : null}

            <Box
              sx={{
                borderRadius: 2,
                border: "1px solid",
                borderColor: alpha(theme.palette.primary.main, 0.2),
                backgroundColor: alpha(theme.palette.primary.main, 0.06),
                p: 2.5,
              }}
            >
              <Box className="flex items-center justify-between gap-2">
                <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
                  {t("form.sections.visibility.title")}
                </Typography>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formik.values.isPublished}
                      onChange={(event) => formik.setFieldValue("isPublished", event.target.checked)}
                      disabled={!canInteract}
                      size="small"
                    />
                  }
                  label=""
                />
              </Box>
              <Typography variant="caption" color="text.secondary">
                {t("form.sections.visibility.description")}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>

      <Box className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Button
          type="button"
          variant="outlined"
          disabled={!canInteract}
          onClick={onCancel}
          className="w-full sm:w-auto"
        >
          {t("form.actions.cancel")}
        </Button>
        <Button
          type="submit"
          variant="contained"
          disabled={!canInteract}
          startIcon={formik.isSubmitting ? <CircularProgress size={18} color="inherit" /> : <SaveRoundedIcon />}
          className="w-full sm:w-auto"
        >
          {t("form.actions.save")}
        </Button>
      </Box>
    </Box>
  );
}
