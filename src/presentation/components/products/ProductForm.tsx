"use client";

import AddPhotoAlternateRoundedIcon from "@mui/icons-material/AddPhotoAlternateRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
import {
  Alert,
  alpha,
  Box,
  Button,
  CircularProgress,
  IconButton,
  InputAdornment,
  Switch,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { useFormik } from "formik";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

import { CreateProductUseCase } from "@/domain/usecases/products/CreateProductUseCase";
import { appContainer } from "@/infrastructure/ioc/container";
import { USE_CASE_TYPES } from "@/infrastructure/ioc/usecases/usecases.types";
import {
  createProductFormValidationSchema,
  parsePriceInput,
  type ProductFormValues,
} from "@/presentation/components/products/productFormValidation";

const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = new Set(["image/png", "image/jpeg", "image/jpg"]);

const productErrorKeyList = [
  "errors.unauthorized",
  "errors.connection",
  "errors.storageUnavailable",
  "errors.generic",
] as const;
type ProductErrorKey = (typeof productErrorKeyList)[number];

const formatPriceValue = (value: string, locale: string) => {
  const digits = value.replace(/[^\d]/g, "");
  if (!digits) return "";
  const formatter = new Intl.NumberFormat(locale);
  return formatter.format(Number(digits));
};

const fileToDataUrl = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result ?? ""));
    reader.onerror = () => reject(new Error("read_failed"));
    reader.readAsDataURL(file);
  });

export function ProductForm() {
  const theme = useTheme();
  const t = useTranslations("productForm");
  const locale = useLocale();
  const router = useRouter();
  const createProductUseCase = useMemo(
    () => appContainer.get<CreateProductUseCase>(USE_CASE_TYPES.CreateProductUseCase),
    [],
  );

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageFilePreview, setImageFilePreview] = useState<string | null>(null);
  const [imageDataUrl, setImageDataUrl] = useState<string | null>(null);
  const [isReadingFile, setIsReadingFile] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    if (!imageFile) {
      setImageFilePreview(null);
      return;
    }

    const objectUrl = URL.createObjectURL(imageFile);
    setImageFilePreview(objectUrl);

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [imageFile]);

  const validationSchema = useMemo(
    () => createProductFormValidationSchema(t, () => Boolean(imageFile)),
    [t, imageFile],
  );

  const formik = useFormik<ProductFormValues>({
    initialValues: {
      name: "",
      price: "",
      description: "",
      imageUrl: "",
      isPublished: true,
    },
    validationSchema,
    validateOnChange: false,
    validateOnBlur: true,
    onSubmit: async (values, helpers) => {
      setSubmitError(null);

      try {
        const parsedPrice = parsePriceInput(values.price);
        if (parsedPrice === null) {
          throw new Error("errors.generic");
        }

        await createProductUseCase.execute({
          name: values.name.trim(),
          description: values.description.trim(),
          price: parsedPrice,
          imageUrl: imageDataUrl ?? (values.imageUrl.trim() || null),
          imageFile,
          isPublished: values.isPublished,
        });

        router.push(`/${locale}/foundations/products`);
      } catch (error) {
        if (error instanceof Error && error.message) {
          const candidate = error.message as ProductErrorKey;
          setSubmitError(productErrorKeyList.includes(candidate) ? t(candidate) : candidate);
        } else {
          setSubmitError(t("errors.generic"));
        }
      } finally {
        helpers.setSubmitting(false);
      }
    },
  });

  const fieldError = <TKey extends keyof ProductFormValues>(field: TKey) => {
    if (formik.touched[field] || formik.submitCount > 0) {
      return formik.errors[field] as string | undefined;
    }
    return undefined;
  };

  const canInteract = !(formik.isSubmitting || isReadingFile);

  const previewUrl = imageFilePreview ?? imageDataUrl ?? formik.values.imageUrl.trim();
  const previewLabel = imageFile ? imageFile.name : t("sections.image.preview.fromUrl");
  const previewSize = imageFile ? `${(imageFile.size / (1024 * 1024)).toFixed(1)} MB` : null;

  const handleRemoveImage = () => {
    setImageFile(null);
    setImageDataUrl(null);
    setFileError(null);
    void formik.setFieldValue("imageUrl", "", true);
  };

  const handleImageFileChange = async (file: File | null) => {
    setFileError(null);
    if (!file) return;

    if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
      setFileError(t("sections.image.errors.invalidType"));
      return;
    }

    if (file.size > MAX_IMAGE_SIZE_BYTES) {
      setFileError(t("sections.image.errors.tooLarge"));
      return;
    }

    setIsReadingFile(true);
    try {
      const dataUrl = await fileToDataUrl(file);
      setImageFile(file);
      setImageDataUrl(dataUrl);
      void formik.setFieldValue("imageUrl", "", false);
    } catch {
      setFileError(t("sections.image.errors.readFailed"));
      setImageFile(null);
      setImageDataUrl(null);
    } finally {
      setIsReadingFile(false);
    }
  };

  return (
    <Box component="form" noValidate onSubmit={formik.handleSubmit} className="flex flex-col gap-6">
      {fileError ? (
        <Alert severity="error" onClose={() => setFileError(null)}>
          {fileError}
        </Alert>
      ) : null}

      {submitError ? (
        <Alert severity="error" onClose={() => setSubmitError(null)}>
          {submitError}
        </Alert>
      ) : null}

      <Box className="rounded-2xl border border-neutral-200 bg-white p-6 md:p-8">
        <Box className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <Box className="space-y-6 lg:col-span-2">
            <Typography variant="h6" sx={{ fontWeight: 900 }}>
              {t("sections.general.title")}
            </Typography>

            <Box className="space-y-4">
              <TextField
                fullWidth
                required
                disabled={!canInteract}
                {...formik.getFieldProps("name")}
                label={t("fields.name.label")}
                placeholder={t("fields.name.placeholder")}
                error={Boolean(fieldError("name"))}
                helperText={fieldError("name")}
              />

              <TextField
                fullWidth
                required
                disabled={!canInteract}
                value={formik.values.price}
                name="price"
                onChange={(event) => {
                  const formatterLocale = locale === "es" ? "es-CO" : "en-US";
                  const formatted = formatPriceValue(event.target.value, formatterLocale);
                  void formik.setFieldValue("price", formatted, false);
                }}
                onBlur={formik.handleBlur}
                inputMode="numeric"
                label={t("fields.price.label")}
                placeholder={t("fields.price.placeholder")}
                error={Boolean(fieldError("price"))}
                helperText={fieldError("price")}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start" className="font-semibold text-neutral-500">
                      COP
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                fullWidth
                required
                disabled={!canInteract}
                {...formik.getFieldProps("description")}
                multiline
                minRows={5}
                label={t("fields.description.label")}
                placeholder={t("fields.description.placeholder")}
                error={Boolean(fieldError("description"))}
                helperText={fieldError("description")}
              />
            </Box>
          </Box>

          <Box className="space-y-6">
            <Box className="space-y-3">
              <Typography variant="subtitle1" sx={{ fontWeight: 900 }}>
                {t("sections.image.title")}
              </Typography>

              <input
                ref={fileInputRef}
                type="file"
                accept=".png,.jpg,.jpeg,image/png,image/jpeg"
                className="hidden"
                disabled={!canInteract}
                onChange={(event) => {
                  const file = event.target.files?.[0] ?? null;
                  event.target.value = "";
                  handleImageFileChange(file);
                }}
              />

              <Box
                role="button"
                tabIndex={0}
                onClick={() => {
                  if (!canInteract) return;
                  fileInputRef.current?.click();
                }}
                onKeyDown={(event) => {
                  if (!canInteract) return;
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    fileInputRef.current?.click();
                  }
                }}
                aria-label={t("sections.image.upload.ariaLabel")}
                sx={{
                  borderRadius: 3,
                  border: "2px dashed",
                  borderColor: theme.palette.divider,
                  backgroundColor: alpha(theme.palette.primary.main, 0.04),
                  px: 3,
                  py: 4,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  textAlign: "center",
                  cursor: canInteract ? "pointer" : "not-allowed",
                }}
              >
                <Box className="flex flex-col items-center gap-1">
                  <AddPhotoAlternateRoundedIcon className="text-neutral-400" fontSize="large" />
                  <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
                    {t("sections.image.upload.title")}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {t("sections.image.upload.hint")}
                  </Typography>
                </Box>
              </Box>

              <TextField
                fullWidth
                disabled={!canInteract}
                {...formik.getFieldProps("imageUrl")}
                label={t("sections.image.url.label")}
                placeholder={t("sections.image.url.placeholder")}
                error={Boolean(fieldError("imageUrl"))}
                helperText={fieldError("imageUrl")}
                onChange={(event) => {
                  formik.handleChange(event);
                  if (event.target.value.trim().length > 0) {
                    setImageFile(null);
                    setImageDataUrl(null);
                  }
                }}
              />

              {previewUrl ? (
                <Box className="flex items-center gap-3 rounded-xl border border-neutral-100 bg-neutral-50 p-3">
                  <Box
                    className="h-12 w-12 rounded-lg border border-neutral-200 bg-neutral-100 bg-cover bg-center"
                    sx={{ backgroundImage: `url(${previewUrl})` }}
                    aria-label={t("sections.image.preview.label")}
                  />
                  <Box className="flex-1">
                    <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
                      {previewLabel}
                    </Typography>
                    {previewSize ? (
                      <Typography variant="caption" color="text.secondary">
                        {previewSize}
                      </Typography>
                    ) : null}
                  </Box>
                  <IconButton
                    size="small"
                    aria-label={t("sections.image.preview.remove")}
                    disabled={!canInteract}
                    onClick={handleRemoveImage}
                  >
                    <DeleteRoundedIcon fontSize="small" />
                  </IconButton>
                </Box>
              ) : null}
            </Box>

            <Box
              className="rounded-xl border border-transparent p-4"
              sx={{
                borderColor: alpha(theme.palette.primary.main, 0.2),
                backgroundColor: alpha(theme.palette.primary.main, 0.08),
              }}
            >
              <Box className="flex items-center justify-between gap-3">
                <Typography variant="subtitle2" sx={{ fontWeight: 900 }}>
                  {t("sections.visibility.title")}
                </Typography>
                <Switch
                  checked={formik.values.isPublished}
                  onChange={(event) => formik.setFieldValue("isPublished", event.target.checked)}
                  disabled={!canInteract}
                  inputProps={{ "aria-label": t("sections.visibility.toggleAria") }}
                />
              </Box>
              <Typography variant="caption" color="text.secondary">
                {t("sections.visibility.description")}
              </Typography>
            </Box>
          </Box>
        </Box>

        <Box className="mt-8 flex flex-col-reverse gap-3 border-t border-neutral-100 pt-6 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="text"
            disabled={!canInteract}
            onClick={() => {
              router.push(`/${locale}/foundations/products`);
            }}
            className="w-full sm:w-auto"
          >
            {t("actions.cancel")}
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={!canInteract}
            startIcon={
              formik.isSubmitting ? <CircularProgress size={18} color="inherit" /> : <SaveRoundedIcon />
            }
            className="w-full sm:w-auto"
          >
            {t("actions.save")}
          </Button>
        </Box>
      </Box>

      <Box className="flex items-center justify-center gap-2 text-neutral-400">
        <InfoOutlinedIcon fontSize="small" />
        <Typography variant="caption">{t("footer.hint")}</Typography>
      </Box>
    </Box>
  );
}
