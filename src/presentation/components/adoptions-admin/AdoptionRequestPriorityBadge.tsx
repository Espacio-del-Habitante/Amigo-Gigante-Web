"use client";

import { alpha, useTheme } from "@mui/material";
import { useTranslations } from "next-intl";

import type { AdoptionRequestPriority } from "@/domain/models/AdoptionRequest";
import { Chip } from "@/presentation/components/atoms";

export interface AdoptionRequestPriorityBadgeProps {
  priority: AdoptionRequestPriority;
}

export function AdoptionRequestPriorityBadge({ priority }: AdoptionRequestPriorityBadgeProps) {
  const t = useTranslations("adoptionsAdmin");
  const theme = useTheme();

  const priorityColorMap: Record<AdoptionRequestPriority, string> = {
    high: theme.palette.error.main,
    medium: theme.palette.warning.main,
    low: theme.palette.info.main,
  };

  const color = priorityColorMap[priority];

  return (
    <Chip
      label={t(`priority.${priority}`)}
      size="small"
      sx={{
        backgroundColor: alpha(color, 0.12),
        color,
      }}
    />
  );
}
