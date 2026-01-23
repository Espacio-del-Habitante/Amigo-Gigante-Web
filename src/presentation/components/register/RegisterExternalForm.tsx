"use client";

import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import VisibilityOffRoundedIcon from "@mui/icons-material/VisibilityOffRounded";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import {
  alpha,
  Box,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  InputAdornment,
  Stack,
  TextField,
  Typography,
  useTheme,
  type SxProps,
  type Theme,
} from "@mui/material";
import { type FieldInputProps, useFormik } from "formik";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { type ReactElement, useMemo, useState } from "react";

import { RegisterExternalUserUseCase } from "@/domain/usecases/auth/RegisterExternalUserUseCase";
import { appContainer } from "@/infrastructure/ioc/container";
import { USE_CASE_TYPES } from "@/infrastructure/ioc/usecases/usecases.types";
import { Button } from "@/presentation/components/atoms";
import {
  createRegisterExternalValidationSchema,
  type RegisterExternalFormValues,
} from "@/presentation/components/register/registerExternalValidation";

interface RegisterExternalFormProps {
  ctaIcon?: ReactElement;
}

interface PasswordFieldProps {
  label: string;
  placeholder: string;
  fieldProps: FieldInputProps<string>;
  error?: string;
  disabled?: boolean;
  textFieldStyles: SxProps<Theme>;
  showLabel: string;
  hideLabel: string;
  getToggleAriaLabel: (action: string, label: string) => string;
}

const errorMessageKeyList = [
  "external.errors.emailExists",
  "external.errors.passwordMinLength",
  "external.errors.connectionError",
  "external.errors.validationError",
  "external.errors.rateLimit",
  "external.errors.generic",
] as const;

type RegisterExternalErrorMessageKey = (typeof errorMessageKeyList)[number];

const errorMessageKeys = new Set<RegisterExternalErrorMessageKey>(errorMessageKeyList);

function PasswordField({
  label,
  placeholder,
  fieldProps,
  error,
  disabled,
  textFieldStyles,
  showLabel,
  hideLabel,
  getToggleAriaLabel,
}: PasswordFieldProps) {
  const [show, setShow] = useState(false);
  const actionLabel = show ? hideLabel : showLabel;
  const ariaLabel = getToggleAriaLabel(actionLabel, label);

  return (
    <TextField
      {...fieldProps}
      label={label}
      type={show ? "text" : "password"}
      placeholder={placeholder}
      fullWidth
      disabled={disabled}
      error={Boolean(error)}
      helperText={error}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <Button
              variant="ghost"
              tone="neutral"
              type="button"
              onClick={() => setShow((prev) => !prev)}
              aria-label={ariaLabel}
              sx={{
                minWidth: 0,
                px: 1.25,
                py: 0.75,
                fontSize: 13,
                fontWeight: 700,
              }}
              startIcon={show ? <VisibilityOffRoundedIcon /> : <VisibilityRoundedIcon />}
            >
              {actionLabel}
            </Button>
          </InputAdornment>
        ),
      }}
      sx={textFieldStyles}
    />
  );
}

export function RegisterExternalForm({ ctaIcon }: RegisterExternalFormProps) {
  const theme = useTheme();
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("register");
  const registerExternalUserUseCase = useMemo(
    () => appContainer.get<RegisterExternalUserUseCase>(USE_CASE_TYPES.RegisterExternalUserUseCase),
    [],
  );

  const [submitError, setSubmitError] = useState<string | null>(null);

  const textFieldStyles = useMemo<SxProps<Theme>>(
    () => ({
      "& .MuiOutlinedInput-root": {
        borderRadius: 2,
        "& fieldset": { borderColor: theme.palette.divider },
        "&:hover fieldset": {
          borderColor: alpha(theme.palette.primary.main, 0.6),
          boxShadow: `${theme.shadows[0]}, 0 0 0 4px ${alpha(theme.palette.primary.main, 0.1)}`,
        },
        "&.Mui-focused fieldset": {
          borderColor: theme.palette.primary.main,
          boxShadow: `${theme.shadows[1]}, 0 0 0 4px ${alpha(theme.palette.primary.main, 0.18)}`,
        },
      },
      "& .MuiInputBase-input::placeholder": {
        color: theme.palette.text.secondary,
        opacity: 1,
      },
    }),
    [theme],
  );

  const validationSchema = useMemo(() => createRegisterExternalValidationSchema(t), [t]);

  const resolveErrorMessage = (error: unknown) => {
    if (error instanceof Error) {
      const key = error.message as RegisterExternalErrorMessageKey;
      if (errorMessageKeys.has(key)) {
        return t(key);
      }

      return error.message;
    }

    return t("external.errors.generic");
  };

  const formik = useFormik<RegisterExternalFormValues>({
    initialValues: {
      fullName: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      acceptTerms: false,
    },
    validationSchema,
    validateOnChange: false,
    validateOnBlur: true,
    onSubmit: async (values, helpers) => {
      setSubmitError(null);

      try {
        await registerExternalUserUseCase.execute({
          email: values.email.trim(),
          password: values.password,
          displayName: values.fullName.trim(),
          phone: values.phone.trim() || undefined,
        });

        helpers.resetForm();
        router.push(`/${locale}`);
      } catch (error) {
        setSubmitError(resolveErrorMessage(error));
      } finally {
        helpers.setSubmitting(false);
      }
    },
  });

  const fieldError = (field: keyof RegisterExternalFormValues) => {
    if (formik.touched[field] || formik.submitCount > 0) {
      return formik.errors[field];
    }
    return undefined;
  };

  const hasValidationErrors =
    Object.keys(formik.errors).length > 0 &&
    (formik.submitCount > 0 || Object.values(formik.touched).some((value) => Boolean(value)));

  const isSubmitDisabled = formik.isSubmitting || formik.isValidating || hasValidationErrors;

  return (
    <Box
      className="rounded-2xl bg-white"
      component="form"
      noValidate
      onSubmit={formik.handleSubmit}
      sx={{
        border: "1px solid",
        borderColor: "divider",
        boxShadow: theme.shadows[2],
        p: { xs: 3, md: 4 },
        display: "flex",
        flexDirection: "column",
        gap: 3,
      }}
    >
      <Stack spacing={1.5}>
        <Typography variant="h4" sx={{ fontWeight: 900 }}>
          {t("external.title")}
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7, maxWidth: 520 }}>
          {t("external.subtitle")}
        </Typography>
      </Stack>

      <Stack spacing={2.5}>
        <TextField
          {...formik.getFieldProps("fullName")}
          label={t("external.form.fullName.label")}
          placeholder={t("external.form.fullName.placeholder")}
          fullWidth
          disabled={formik.isSubmitting}
          error={Boolean(fieldError("fullName"))}
          helperText={fieldError("fullName")}
          sx={textFieldStyles}
        />
        <Box className="grid gap-4 md:grid-cols-2">
          <TextField
            {...formik.getFieldProps("email")}
            label={t("external.form.email.label")}
            placeholder={t("external.form.email.placeholder")}
            type="email"
            fullWidth
            disabled={formik.isSubmitting}
            error={Boolean(fieldError("email"))}
            helperText={fieldError("email")}
            sx={textFieldStyles}
          />
          <TextField
            {...formik.getFieldProps("phone")}
            label={t("external.form.phone.label")}
            placeholder={t("external.form.phone.placeholder")}
            type="tel"
            fullWidth
            disabled={formik.isSubmitting}
            error={Boolean(fieldError("phone"))}
            helperText={fieldError("phone")}
            sx={textFieldStyles}
          />
        </Box>
        <Box className="grid gap-4 md:grid-cols-2">
          <PasswordField
            label={t("external.form.password.label")}
            placeholder={t("external.form.password.placeholder")}
            fieldProps={formik.getFieldProps("password")}
            error={fieldError("password")}
            disabled={formik.isSubmitting}
            textFieldStyles={textFieldStyles}
            showLabel={t("external.form.passwordToggle.show")}
            hideLabel={t("external.form.passwordToggle.hide")}
            getToggleAriaLabel={(action, label) =>
              t("external.form.passwordToggle.aria", { action, label })
            }
          />
          <PasswordField
            label={t("external.form.confirmPassword.label")}
            placeholder={t("external.form.confirmPassword.placeholder")}
            fieldProps={formik.getFieldProps("confirmPassword")}
            error={fieldError("confirmPassword")}
            disabled={formik.isSubmitting}
            textFieldStyles={textFieldStyles}
            showLabel={t("external.form.passwordToggle.show")}
            hideLabel={t("external.form.passwordToggle.hide")}
            getToggleAriaLabel={(action, label) =>
              t("external.form.passwordToggle.aria", { action, label })
            }
          />
        </Box>
        <Stack spacing={0.5}>
          <FormControlLabel
            control={
              <Checkbox
                color="primary"
                checked={formik.values.acceptTerms}
                onChange={(event) => formik.setFieldValue("acceptTerms", event.target.checked)}
                onBlur={formik.handleBlur}
                disabled={formik.isSubmitting}
                sx={{ "&.Mui-checked": { color: theme.palette.primary.main } }}
              />
            }
            label={
              <Typography variant="body2" color="text.secondary">
                {t.rich("external.form.terms.label", {
                  terms: (chunks) => (
                    <Link
                      href={`/${locale}/terms`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-neutral-900 underline decoration-neutral-300 underline-offset-2 hover:decoration-brand-500"
                    >
                      {chunks}
                    </Link>
                  ),
                  privacy: (chunks) => (
                    <Link
                      href={`/${locale}/privacy`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-neutral-900 underline decoration-neutral-300 underline-offset-2 hover:decoration-brand-500"
                    >
                      {chunks}
                    </Link>
                  ),
                })}
              </Typography>
            }
            sx={{
              alignItems: "flex-start",
              "& .MuiCheckbox-root": { mt: 0.25 },
            }}
          />
          {fieldError("acceptTerms") && (
            <Typography variant="caption" color="error" sx={{ ml: 4.5 }}>
              {fieldError("acceptTerms")}
            </Typography>
          )}
        </Stack>
        <Button
          type="submit"
          variant="solid"
          rounded="pill"
          startIcon={
            formik.isSubmitting ? <CircularProgress size={20} color="inherit" /> : ctaIcon ?? <ArrowForwardRoundedIcon />
          }
          disabled={isSubmitDisabled}
          sx={{ height: 54, fontSize: 16, fontWeight: 800, boxShadow: theme.shadows[3] }}
        >
          {formik.isSubmitting ? t("external.form.submitting") : t("external.form.submit")}
        </Button>

        {submitError && (
          <Box
            role="alert"
            sx={{
              borderRadius: 1,
              border: "1px solid",
              borderColor: theme.palette.error.light,
              backgroundColor: alpha(theme.palette.error.light, 0.12),
              color: theme.palette.error.main,
              px: 2,
              py: 1.5,
              fontSize: 14,
              fontWeight: 600,
            }}
          >
            {submitError}
          </Box>
        )}
      </Stack>

      <Box
        sx={{
          mt: 1,
          display: "flex",
          alignItems: "center",
          gap: 1,
          color: theme.palette.text.secondary,
          fontSize: 14,
        }}
      >
        <Typography variant="body2">{t("external.form.alreadyHaveAccount")}</Typography>
        <Link
          href={`/${locale}/login`}
          className="font-semibold text-brand-600 transition-colors hover:text-brand-700"
          aria-label={t("external.form.login")}
        >
          {t("external.form.login")}
        </Link>
      </Box>
    </Box>
  );
}
