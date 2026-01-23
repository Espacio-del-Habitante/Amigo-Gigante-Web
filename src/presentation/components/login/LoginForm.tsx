"use client";

import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import MailRoundedIcon from "@mui/icons-material/MailRounded";
import {
  alpha,
  Box,
  CircularProgress,
  InputAdornment,
  Stack,
  TextField,
  Typography,
  useTheme,
  type SxProps,
  type Theme,
} from "@mui/material";
import { useFormik } from "formik";
import { useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

import type { UserRole } from "@/domain/types/auth.types";
import { LoginUseCase } from "@/domain/usecases/auth/LoginUseCase";
import { appContainer } from "@/infrastructure/ioc/container";
import { USE_CASE_TYPES } from "@/infrastructure/ioc/usecases/usecases.types";
import { locales } from "@/i18n/config";
import { Button, Chip } from "@/presentation/components/atoms";
import { PasswordInput } from "@/presentation/components/login/PasswordInput";

interface LoginFormValues {
  email: string;
  password: string;
}

const errorMessageKeyList = [
  "form.errors.invalidCredentials",
  "form.errors.userNotFound",
  "form.errors.connectionError",
  "form.errors.emailNotVerified",
  "form.errors.rateLimit",
  "form.errors.generic",
] as const;

type LoginErrorMessageKey = (typeof errorMessageKeyList)[number];

const errorMessageKeys = new Set<LoginErrorMessageKey>(errorMessageKeyList);

export function LoginForm() {
  const theme = useTheme();
  const t = useTranslations("login");
  const router = useRouter();
  const locale = useLocale();
  const searchParams = useSearchParams();
  const loginUseCase = useMemo(
    () => appContainer.get<LoginUseCase>(USE_CASE_TYPES.LoginUseCase),
    [],
  );
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [userType, setUserType] = useState<"adopter" | "foundation">("adopter");

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

  const getRedirectTarget = (role: UserRole) => {
    const redirectTo = searchParams.get("redirectTo");

    if (redirectTo) {
      const normalized = normalizeRedirectPath(redirectTo, locale);
      if (normalized) {
        return normalized;
      }
    }

    if (role === "foundation_user") {
      return `/${locale}/foundations`;
    }

    if (role === "admin") {
      return `/${locale}/admin`;
    }

    if (role === "external") {
      return `/${locale}`;
    }

    return `/${locale}`;
  };

  const resolveErrorMessage = (error: unknown) => {
    if (error instanceof Error) {
      const key = error.message as LoginErrorMessageKey;
      if (errorMessageKeys.has(key)) {
        return t(key);
      }
    }

    return t("form.errors.generic");
  };

  const formik = useFormik<LoginFormValues>({
    initialValues: {
      email: "",
      password: "",
    },
    validateOnChange: false,
    validateOnBlur: true,
    onSubmit: async (values, helpers) => {
      setSubmitError(null);

      try {
        const result = await loginUseCase.execute({
          email: values.email.trim(),
          password: values.password,
        });

        helpers.resetForm();
        router.push(getRedirectTarget(result.role));
      } catch (error) {
        setSubmitError(resolveErrorMessage(error));
      } finally {
        helpers.setSubmitting(false);
      }
    },
  });

  const isSubmitDisabled = formik.isSubmitting || formik.isValidating;

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
        "& input[type='radio']": {
          position: "absolute",
          opacity: 0,
          pointerEvents: "none",
        },
        "& #foundation:checked ~ .user-type-selector label[for='foundation']": {
          backgroundColor: theme.palette.background.paper,
          color: theme.palette.text.primary,
          boxShadow: theme.shadows[1],
        },
        "& #adopter:checked ~ .user-type-selector label[for='adopter']": {
          backgroundColor: theme.palette.background.paper,
          color: theme.palette.text.primary,
          boxShadow: theme.shadows[1],
        },
        "& #foundation:checked ~ .login-subtitle .foundation-content": {
          display: "block",
        },
        "& #foundation:checked ~ .login-subtitle .adopter-content": {
          display: "none",
        },
        "& #adopter:checked ~ .login-subtitle .foundation-content": {
          display: "none",
        },
        "& #adopter:checked ~ .login-subtitle .adopter-content": {
          display: "block",
        },
        "& #foundation:checked ~ .login-content .foundation-content": {
          display: "block",
        },
        "& #foundation:checked ~ .login-content .adopter-content": {
          display: "none",
        },
        "& #adopter:checked ~ .login-content .foundation-content": {
          display: "none",
        },
        "& #adopter:checked ~ .login-content .adopter-content": {
          display: "block",
        },
      }}
    >
      <input
        type="radio"
        id="adopter"
        name="userType"
        value="adopter"
        checked={userType === "adopter"}
        onChange={() => setUserType("adopter")}
      />
      <input
        type="radio"
        id="foundation"
        name="userType"
        value="foundation"
        checked={userType === "foundation"}
        onChange={() => setUserType("foundation")}
      />

      <Stack spacing={1.5} className="login-subtitle">
        <Typography variant="h4" sx={{ fontWeight: 900 }}>
          {t("form.title")}
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ lineHeight: 1.7, maxWidth: 520 }}
          className="adopter-content"
        >
          {t("form.subtitle.adopter")}
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ lineHeight: 1.7, maxWidth: 520, display: "none" }}
          className="foundation-content"
        >
          {t("form.subtitle.foundation")}
        </Typography>
      </Stack>

      <Stack
        className="user-type-selector"
        direction={{ xs: "column", sm: "row" }}
        spacing={1}
        sx={{
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 999,
          p: 0.5,
          backgroundColor: alpha(theme.palette.primary.main, 0.04),
        }}
      >
        <Box
          component="label"
          htmlFor="adopter"
          sx={{
            flex: 1,
            textAlign: "center",
            py: 1,
            px: 2,
            borderRadius: 999,
            cursor: "pointer",
            color: "text.secondary",
            fontWeight: 700,
            transition: "all 0.2s ease",
          }}
        >
          {t("form.userType.adopter")}
        </Box>
        <Box
          component="label"
          htmlFor="foundation"
          sx={{
            flex: 1,
            textAlign: "center",
            py: 1,
            px: 2,
            borderRadius: 999,
            cursor: "pointer",
            color: "text.secondary",
            fontWeight: 700,
            transition: "all 0.2s ease",
          }}
        >
          {t("form.userType.foundation")}
        </Box>
      </Stack>

      <Stack spacing={2.5} className="login-content">
        <TextField
          {...formik.getFieldProps("email")}
          type="email"
          label={t("form.email.label")}
          placeholder={t("form.email.placeholder")}
          fullWidth
          disabled={formik.isSubmitting}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Box sx={{ color: "text.secondary", display: "flex" }}>
                  <MailRoundedIcon fontSize="small" />
                </Box>
              </InputAdornment>
            ),
          }}
          sx={textFieldStyles}
        />
        <PasswordInput
          label={t("form.password.label")}
          placeholder={t("form.password.placeholder")}
          fieldProps={formik.getFieldProps("password")}
          disabled={formik.isSubmitting}
          textFieldStyles={textFieldStyles}
        />
        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          <Link
            href="#"
            className="text-sm font-semibold text-neutral-600 transition-colors hover:text-brand-600"
          >
            {t("form.forgotPassword")}
          </Link>
        </Box>
        <Chip
          tone="brand"
          variant="soft"
          icon={<CheckCircleRoundedIcon fontSize="small" />}
          label={t("form.secureLogin")}
          sx={{ alignSelf: "flex-start" }}
        />
        <Button
          type="submit"
          variant="solid"
          rounded="pill"
          startIcon={formik.isSubmitting ? <CircularProgress size={20} color="inherit" /> : undefined}
          disabled={isSubmitDisabled}
          sx={{ height: 54, fontSize: 16, fontWeight: 800, boxShadow: theme.shadows[3] }}
        >
          {formik.isSubmitting ? t("form.submitting") : t("form.submit")}
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
        <Stack direction="row" alignItems="center" spacing={1} className="adopter-content">
          <Typography variant="body2" color="text.secondary">
            {t("form.register.adopter.text")}
          </Typography>
          <Link
            href={`/${locale}/register`}
            className="text-sm font-semibold text-brand-600 transition-colors hover:text-brand-700"
          >
            {t("form.register.adopter.link")}
          </Link>
        </Stack>
        <Stack
          direction="row"
          alignItems="center"
          spacing={1}
          className="foundation-content"
          sx={{ display: "none" }}
        >
          <Typography variant="body2" color="text.secondary">
            {t("form.register.foundation.text")}
          </Typography>
          <Link
            href={`/${locale}/register`}
            className="text-sm font-semibold text-brand-600 transition-colors hover:text-brand-700"
          >
            {t("form.register.foundation.link")}
          </Link>
        </Stack>
      </Stack>
    </Box>
  );
}

const normalizeRedirectPath = (redirectTo: string, locale: string) => {
  if (!redirectTo.startsWith("/") || redirectTo.startsWith("//") || redirectTo.includes("://")) {
    return null;
  }

  const match = redirectTo.match(/^[^?#]+/);
  const path = match ? match[0] : redirectTo;
  const suffix = redirectTo.slice(path.length);

  const hasLocalePrefix = locales.some(
    (supportedLocale) =>
      path === `/${supportedLocale}` || path.startsWith(`/${supportedLocale}/`),
  );

  if (hasLocalePrefix) {
    return redirectTo;
  }

  return `/${locale}${path === "/" ? "" : path}${suffix}`;
};
