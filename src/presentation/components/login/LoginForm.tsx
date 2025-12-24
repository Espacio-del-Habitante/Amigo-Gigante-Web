"use client";

import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import MailRoundedIcon from "@mui/icons-material/MailRounded";
import { alpha, Box, InputAdornment, Stack, TextField, Typography, useTheme, type SxProps, type Theme } from "@mui/material";
import { useMemo } from "react";
import { useTranslations } from "next-intl";
import Link from "next/link";

import { Button, Chip } from "@/presentation/components/atoms";
import { PasswordInput } from "@/presentation/components/login/PasswordInput";

export function LoginForm() {
  const theme = useTheme();
  const t = useTranslations("login");

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

  return (
    <Box
      className="rounded-2xl bg-white"
      component="form"
      noValidate
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
          {t("form.title")}
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7, maxWidth: 520 }}>
          {t("form.subtitle")}
        </Typography>
      </Stack>

      <Stack spacing={2.5}>
        <TextField
          id="email"
          name="email"
          type="email"
          label={t("form.email.label")}
          placeholder={t("form.email.placeholder")}
          fullWidth
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
          id="password"
          label={t("form.password.label")}
          placeholder={t("form.password.placeholder")}
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
          sx={{ height: 54, fontSize: 16, fontWeight: 800, boxShadow: theme.shadows[3] }}
        >
          {t("form.submit")}
        </Button>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Typography variant="body2" color="text.secondary">
            {t("form.newUser")}
          </Typography>
          <Link
            href="/register"
            className="text-sm font-semibold text-brand-600 transition-colors hover:text-brand-700"
          >
            {t("form.registerLink")}
          </Link>
        </Stack>
      </Stack>
    </Box>
  );
}
