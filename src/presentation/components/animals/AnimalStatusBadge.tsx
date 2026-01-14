"use client";

import { alpha, useTheme } from "@mui/material";
import { useTranslations } from "next-intl";

import type { AnimalManagementStatus } from "@/infrastructure/mocks/animals-management.mock";
import { Chip } from "@/presentation/components/atoms";

export interface AnimalStatusBadgeProps {
  status: AnimalManagementStatus;
}

export function AnimalStatusBadge({ status }: AnimalStatusBadgeProps) {
  const t = useTranslations("animals");
  const theme = useTheme();

  const statusColorMap: Record<AnimalManagementStatus, string> = {
    available: theme.palette.success.main,
    adopted: theme.palette.info.main,
    pending: theme.palette.warning.main,
    in_treatment: theme.palette.secondary.main,
    inactive: theme.palette.error.main,
  };

  const color = statusColorMap[status];
  const label = t(`filters.status.${status}`);

  return (
    <Chip
      label={label}
      size="small"
      sx={{
        backgroundColor: alpha(color, 0.12),
        color,
      }}
    />
  );
}

