"use client";

import { alpha, Avatar, Box, Typography, useTheme } from "@mui/material";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";

import type { AdoptionRequestStatus, UserAdoptionRequestSummary } from "@/domain/models/AdoptionRequest";
import { Button, Chip } from "@/presentation/components/atoms";

interface AdoptionRequestCardProps {
  request: UserAdoptionRequestSummary;
}

const formatDateLabel = (dateIso: string, locale: string) =>
  new Intl.DateTimeFormat(locale, {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(dateIso));

export function AdoptionRequestCard({ request }: AdoptionRequestCardProps) {
  const t = useTranslations("myAdoptions");
  const theme = useTheme();
  const locale = useLocale();

  const statusColorMap: Record<AdoptionRequestStatus, string> = {
    pending: theme.palette.warning.main,
    in_review: theme.palette.warning.main,
    info_requested: theme.palette.secondary.main,
    preapproved: theme.palette.primary.main,
    approved: theme.palette.success.main,
    rejected: theme.palette.error.main,
    cancelled: theme.palette.grey[500],
    completed: theme.palette.success.dark,
  };

  const speciesTone = request.animal.species === "cat" ? "accent" : "brand";

  const formattedDate = formatDateLabel(request.createdAt, locale);
  const animalInitial = request.animal.name ? request.animal.name.slice(0, 1).toUpperCase() : "?";
  const statusColor = statusColorMap[request.status];

  return (
    <Box className="group flex flex-col gap-4 rounded-xl border border-neutral-100 bg-white p-6 shadow-soft transition-all hover:border-brand-300 md:flex-row md:items-center md:justify-between">
      <Box className="flex items-center gap-6">
        <Avatar
          src={request.animal.coverImageUrl ?? undefined}
          alt={request.animal.name}
          sx={{
            width: 80,
            height: 80,
            border: "2px solid white",
            boxShadow: theme.shadows[1],
          }}
        >
          {animalInitial}
        </Avatar>
        <Box className="flex flex-col gap-1">
          <Box className="flex flex-wrap items-center gap-2">
            <Typography variant="h6" sx={{ fontWeight: 800 }}>
              {request.animal.name}
            </Typography>
            <Chip
              label={t(`species.${request.animal.species}`)}
              size="small"
              tone={speciesTone}
              variant="soft"
              sx={{ textTransform: "uppercase", fontSize: "0.625rem", letterSpacing: "0.08em" }}
            />
          </Box>
          <Typography variant="body2" color="text.secondary" className="flex items-center gap-1">
            <span className="material-symbols-outlined text-base">home</span>
            {request.foundation.name}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {t("requestedOn", { date: formattedDate })}
          </Typography>
        </Box>
      </Box>

      <Box className="flex items-center gap-4">
        <Chip
          label={t(`status.${request.status}`)}
          size="small"
          sx={{
            backgroundColor: alpha(statusColor, 0.16),
            color: statusColor,
            fontWeight: 700,
          }}
        />
        {request.status === "info_requested" ? (
          <Button
            component={Link}
            href={`/${locale}/account/adoptions/${request.id}/respond`}
            size="small"
            tone="primary"
            variant="solid"
          >
            {t("actions.respond")}
          </Button>
        ) : (
          <button
            type="button"
            aria-label={t("actions.view")}
            className="flex h-10 w-10 items-center justify-center rounded-full text-neutral-400 transition-colors hover:text-neutral-600"
          >
            <span className="material-symbols-outlined">chevron_right</span>
          </button>
        )}
      </Box>
    </Box>
  );
}
