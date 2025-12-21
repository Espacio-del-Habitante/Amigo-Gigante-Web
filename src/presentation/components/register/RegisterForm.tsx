"use client";

import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import MailRoundedIcon from "@mui/icons-material/MailRounded";
import VisibilityOffRoundedIcon from "@mui/icons-material/VisibilityOffRounded";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import { alpha, Box, Checkbox, FormControlLabel, InputAdornment, Stack, TextField, Typography, useTheme } from "@mui/material";
import { type ReactElement, useMemo, useState } from "react";

import { Button, Chip } from "@/presentation/components/atoms";

interface RegisterFormProps {
  title: string;
  subtitle: string;
  ctaIcon?: ReactElement;
  badgeIcon?: ReactElement;
}

interface PasswordFieldProps {
  label: string;
  placeholder: string;
}

function PasswordField({ label, placeholder }: PasswordFieldProps) {
  const theme = useTheme();
  const [show, setShow] = useState(false);

  return (
    <TextField
      label={label}
      type={show ? "text" : "password"}
      placeholder={placeholder}
      fullWidth
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <Button
              variant="ghost"
              tone="neutral"
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
      sx={{
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
      }}
    />
  );
}

export function RegisterForm({ title, subtitle, ctaIcon, badgeIcon }: RegisterFormProps) {
  const theme = useTheme();

  const textFieldStyles = useMemo(
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
          label="Foundation Name"
          placeholder="Enter your foundation's official name"
          fullWidth
          sx={textFieldStyles}
        />
        <TextField
          label="Official Email"
          placeholder="foundation@email.com"
          type="email"
          fullWidth
          sx={textFieldStyles}
        />
        <TextField
          label="Tax ID (optional)"
          placeholder="Add your tax ID"
          fullWidth
          sx={textFieldStyles}
        />
        <PasswordField label="Password" placeholder="Create a strong password" />
        <PasswordField label="Confirm Password" placeholder="Re-enter your password" />
        <FormControlLabel
          control={<Checkbox color="primary" sx={{ "&.Mui-checked": { color: theme.palette.primary.main } }} />}
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
        <Button
          variant="solid"
          rounded="pill"
          startIcon={ctaIcon ?? <ArrowForwardRoundedIcon />}
          sx={{ height: 54, fontSize: 16, fontWeight: 800, boxShadow: theme.shadows[3] }}
        >
          Register Foundation
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
