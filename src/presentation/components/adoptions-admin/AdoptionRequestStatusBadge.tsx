"use client";

import { alpha, useTheme } from "@mui/material";
import { useTranslations } from "next-intl";

import type { AdoptionRequestStatus } from "@/domain/models/AdoptionRequest";
import { Chip } from "@/presentation/components/atoms";

export interface AdoptionRequestStatusBadgeProps {
  status: AdoptionRequestStatus;
}

export function AdoptionRequestStatusBadge({ status }: AdoptionRequestStatusBadgeProps) {
  const t = useTranslations("adoptionsAdmin");
  const theme = useTheme();

  const statusColorMap: Record<AdoptionRequestStatus, string> = {
    pending: theme.palette.warning.main,
    in_review: theme.palette.info.main,
    info_requested: theme.palette.secondary.main,
    preapproved: theme.palette.success.main,
    approved: theme.palette.success.main,
    rejected: theme.palette.error.main,
    cancelled: theme.palette.error.main,
    completed: theme.palette.success.dark,
  };

  const color = statusColorMap[status];

  return (
    <Chip
      label={t(`status.${status}`)}
      size="small"
      sx={{
        backgroundColor: alpha(color, 0.12),
        color,
      }}
    />
  );
}
