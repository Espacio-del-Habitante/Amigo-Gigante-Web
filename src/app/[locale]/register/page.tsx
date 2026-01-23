"use client";

import { Box, CircularProgress } from "@mui/material";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";

import type { UserRole } from "@/domain/types/auth.types";
import { RegisterTypeSelectionPage } from "@/presentation/components/register/RegisterTypeSelectionPage";
import { useAuth } from "@/presentation/hooks/useAuth";

const getRedirectTarget = (role: UserRole, locale: string) => {
  if (role === "foundation_user") {
    return `/${locale}/foundations`;
  }

  if (role === "admin") {
    return `/${locale}/admin`;
  }

  return `/${locale}`;
};

export default function RegisterPage() {
  const router = useRouter();
  const locale = useLocale();
  const { isAuthenticated, role, loading } = useAuth();

  const redirectTarget = useMemo(() => {
    if (!role) {
      return null;
    }

    return getRedirectTarget(role, locale);
  }, [locale, role]);

  useEffect(() => {
    if (loading || !isAuthenticated || !redirectTarget) {
      return;
    }

    router.replace(redirectTarget);
  }, [isAuthenticated, loading, redirectTarget, router]);

  if (loading) {
    return (
      <Box className="flex min-h-screen items-center justify-center bg-neutral-50">
        <CircularProgress color="primary" />
      </Box>
    );
  }

  if (isAuthenticated) {
    return null;
  }

  return <RegisterTypeSelectionPage />;
}
