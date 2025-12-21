"use client";

import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import MailRoundedIcon from "@mui/icons-material/MailRounded";
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
import { type ReactElement, useMemo, useState } from "react";

import { Button, Chip } from "@/presentation/components/atoms";
import { registerValidationSchema, type RegisterFormValues } from "@/presentation/components/register/registerValidation";

interface RegisterFormProps {
  title: string;
  subtitle: string;
  ctaIcon?: ReactElement;
  badgeIcon?: ReactElement;
}

interface PasswordFieldProps {
  label: string;
  placeholder: string;
  fieldProps: FieldInputProps<string>;
  error?: string;
  disabled?: boolean;
  textFieldStyles: SxProps<Theme>;
}

function PasswordField({ label, placeholder, fieldProps, error, disabled, textFieldStyles }: PasswordFieldProps) {
  const [show, setShow] = useState(false);

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
              aria-label={`${show ? "Hide" : "Show"} ${label.toLowerCase()}`}
              sx={{
                minWidth: 0,
                px: 1.25,
                py: 0.75,
                fontSize: 13,
                fontWeight: 700,
              }}
              startIcon={show ? <VisibilityOffRoundedIcon /> : <VisibilityRoundedIcon />}
            >
              {show ? "Hide" : "Show"}
            </Button>
          </InputAdornment>
        ),
      }}
      sx={textFieldStyles}
    />
  );
}

export function RegisterForm({ title, subtitle, ctaIcon, badgeIcon }: RegisterFormProps) {
  const theme = useTheme();

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

  const formik = useFormik<RegisterFormValues>({
    initialValues: {
      foundationName: "",
      officialEmail: "",
      taxId: "",
      password: "",
      confirmPassword: "",
      acceptTerms: false,
    },
    validationSchema: registerValidationSchema,
    validateOnChange: false,
    validateOnBlur: true,
    onSubmit: async (values, helpers) => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 700));
        console.log("Register form submitted", values);
      } finally {
        helpers.setSubmitting(false);
      }
    },
  });

  const fieldError = (field: keyof RegisterFormValues) => {
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
      <Stack spacing={2}>
        <Chip
          tone="neutral"
          variant="soft"
          icon={<MailRoundedIcon fontSize="small" />}
          label="Foundation onboarding"
          sx={{ alignSelf: "flex-start" }}
        />
        <Stack spacing={1}>
          <Typography variant="h4" sx={{ fontWeight: 900 }}>
            {title}
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7, maxWidth: 640 }}>
            {subtitle}
          </Typography>
        </Stack>
      </Stack>

      <Stack spacing={2.5}>
        <TextField
          {...formik.getFieldProps("foundationName")}
          label="Foundation Name"
          placeholder="Enter your foundation's official name"
          fullWidth
          disabled={formik.isSubmitting}
          error={Boolean(fieldError("foundationName"))}
          helperText={fieldError("foundationName")}
          sx={textFieldStyles}
        />
        <TextField
          {...formik.getFieldProps("officialEmail")}
          label="Official Email"
          placeholder="foundation@email.com"
          type="email"
          fullWidth
          disabled={formik.isSubmitting}
          error={Boolean(fieldError("officialEmail"))}
          helperText={fieldError("officialEmail")}
          sx={textFieldStyles}
        />
        <TextField
          {...formik.getFieldProps("taxId")}
          label="Tax ID (optional)"
          placeholder="Add your tax ID"
          fullWidth
          disabled={formik.isSubmitting}
          error={Boolean(fieldError("taxId"))}
          helperText={fieldError("taxId") ?? ""}
          sx={textFieldStyles}
        />
        <PasswordField
          label="Password"
          placeholder="Create a strong password"
          fieldProps={formik.getFieldProps("password")}
          error={fieldError("password")}
          disabled={formik.isSubmitting}
          textFieldStyles={textFieldStyles}
        />
        <PasswordField
          label="Confirm Password"
          placeholder="Re-enter your password"
          fieldProps={formik.getFieldProps("confirmPassword")}
          error={fieldError("confirmPassword")}
          disabled={formik.isSubmitting}
          textFieldStyles={textFieldStyles}
        />
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
                I agree to the Terms & Conditions and confirm the information is accurate.
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
          {formik.isSubmitting ? "Enviando..." : "Register Foundation"}
        </Button>

        <Stack direction="row" alignItems="center" spacing={1}>
          <Chip
            tone="brand"
            variant="soft"
            icon={badgeIcon ?? <CheckRoundedIcon fontSize="small" />}
            label="Secure Registration"
            sx={{ fontWeight: 700 }}
          />
          <Typography variant="body2" color="text.secondary">
            Data encrypted and protected
          </Typography>
        </Stack>
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
        <Typography variant="body2">Already have an account?</Typography>
        <a
          href="/login"
          className="font-semibold text-brand-600 transition-colors hover:text-brand-700"
          aria-label="Log in"
        >
          Log in
        </a>
      </Box>
    </Box>
  );
}
