"use client";

import VisibilityOffRoundedIcon from "@mui/icons-material/VisibilityOffRounded";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import LockRoundedIcon from "@mui/icons-material/LockRounded";
import { Box, IconButton, InputAdornment, TextField, type SxProps, type Theme } from "@mui/material";
import { useState } from "react";
import { useTranslations } from "next-intl";

interface PasswordInputProps {
  id: string;
  label: string;
  placeholder: string;
  textFieldStyles: SxProps<Theme>;
}

export function PasswordInput({ id, label, placeholder, textFieldStyles }: PasswordInputProps) {
  const t = useTranslations("login");
  const [showPassword, setShowPassword] = useState(false);

  const actionLabel = showPassword ? t("form.passwordToggle.hide") : t("form.passwordToggle.show");

  return (
    <TextField
      id={id}
      name={id}
      label={label}
      type={showPassword ? "text" : "password"}
      placeholder={placeholder}
      fullWidth
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <Box sx={{ color: "text.secondary", display: "flex" }}>
              <LockRoundedIcon fontSize="small" />
            </Box>
          </InputAdornment>
        ),
        endAdornment: (
          <InputAdornment position="end">
            <IconButton
              edge="end"
              aria-label={t("form.passwordToggle.aria", { action: actionLabel })}
              onClick={() => setShowPassword((prev) => !prev)}
              sx={{ color: "text.secondary" }}
            >
              {showPassword ? <VisibilityOffRoundedIcon /> : <VisibilityRoundedIcon />}
            </IconButton>
          </InputAdornment>
        ),
      }}
      sx={textFieldStyles}
    />
  );
}
