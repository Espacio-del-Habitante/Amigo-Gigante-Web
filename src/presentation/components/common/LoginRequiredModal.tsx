"use client";

import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import LockRoundedIcon from "@mui/icons-material/LockRounded";
import {
  Box,
  Dialog,
  DialogContent,
  IconButton,
  Typography,
} from "@mui/material";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Button } from "@/presentation/components/atoms";

interface LoginRequiredModalProps {
  open: boolean;
  onClose: () => void;
  redirectTo?: string;
  title?: string;
  description?: string;
}

export function LoginRequiredModal({
  open,
  onClose,
  redirectTo,
  title,
  description,
}: LoginRequiredModalProps) {
  const t = useTranslations("loginRequired");
  const locale = useLocale();
  const router = useRouter();

  const handleLogin = () => {
    const loginUrl = redirectTo
      ? `/${locale}/login?redirectTo=${encodeURIComponent(redirectTo)}`
      : `/${locale}/login`;
    router.push(loginUrl);
    onClose();
  };

  const handleRegister = () => {
    const registerUrl = redirectTo
      ? `/${locale}/register/external?redirectTo=${encodeURIComponent(redirectTo)}`
      : `/${locale}/register/external`;
    router.push(registerUrl);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      BackdropProps={{ className: "bg-neutral-900/60 backdrop-blur-sm" }}
      PaperProps={{ className: "overflow-hidden rounded-2xl border border-neutral-100 shadow-strong" }}
    >
      <DialogContent className="relative p-0">
        <IconButton
          aria-label={t("actions.close")}
          onClick={onClose}
          className="absolute right-4 top-4 z-10"
          sx={{
            color: "text.secondary",
            "&:hover": {
              backgroundColor: "action.hover",
            },
          }}
        >
          <CloseRoundedIcon />
        </IconButton>

        <Box className="p-8 text-center">
          <Box className="mb-6 flex justify-center">
            <Box className="flex h-20 w-20 items-center justify-center rounded-full bg-brand-50">
              <LockRoundedIcon sx={{ fontSize: 40, color: "primary.main" }} />
            </Box>
          </Box>

          <Box className="mb-6 space-y-2">
            <Typography variant="h5" component="h2" sx={{ fontWeight: 900 }}>
              {title || t("title")}
            </Typography>
            <Typography variant="body2" color="text.secondary" className="max-w-md mx-auto">
              {description || t("description")}
            </Typography>
          </Box>

          <Box className="flex flex-col gap-3">
            <Button
              fullWidth
              variant="solid"
              tone="primary"
              onClick={handleLogin}
              sx={{ fontWeight: 900 }}
            >
              {t("actions.login")}
            </Button>
            <Button
              fullWidth
              variant="outlined"
              tone="primary"
              onClick={handleRegister}
              sx={{ fontWeight: 700 }}
            >
              {t("actions.register")}
            </Button>
          </Box>

          <Typography variant="caption" color="text.secondary" className="mt-4 block">
            {t("footer")}
          </Typography>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
