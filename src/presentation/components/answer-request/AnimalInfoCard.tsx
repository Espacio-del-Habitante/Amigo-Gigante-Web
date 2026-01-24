"use client";

import { Avatar, Typography } from "@mui/material";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";

import type { UserAdoptionRequestSummary } from "@/domain/models/AdoptionRequest";
import { Button, Chip } from "@/presentation/components/atoms";

interface AnimalInfoCardProps {
  request: UserAdoptionRequestSummary;
}

export function AnimalInfoCard({ request }: AnimalInfoCardProps) {
  const t = useTranslations("answerRequest");
  const tMyAdoptions = useTranslations("myAdoptions");
  const locale = useLocale();

  const speciesTone = request.animal.species === "cat" ? "accent" : "brand";

  return (
    <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-soft">
      <div className="border-b border-neutral-100 px-4 py-3">
        <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400">{t("animalCard.title")}</p>
      </div>
      <div className="p-6 text-center">
        <Avatar
          src={request.animal.coverImageUrl ?? undefined}
          alt={request.animal.name}
          sx={{ width: 160, height: 160, margin: "0 auto 16px" }}
        />
        <Typography variant="h5" sx={{ fontWeight: 900 }}>
          {request.animal.name}
        </Typography>
        <div className="mt-1 flex items-center justify-center gap-2 text-sm text-neutral-500">
          <Chip
            label={tMyAdoptions(`species.${request.animal.species}`)}
            size="small"
            tone={speciesTone}
            variant="soft"
            sx={{ textTransform: "uppercase", fontSize: "0.625rem", letterSpacing: "0.08em" }}
          />
        </div>
        <div className="mt-3 flex items-center justify-center">
          <Chip label={tMyAdoptions(`status.${request.status}`)} size="small" tone="primary" variant="soft" />
        </div>
        <Button
          component={Link}
          href={`/${locale}/adopt/${request.animal.id}`}
          tone="primary"
          variant="outlined"
          size="small"
          className="mt-6 w-full"
        >
          {t("animalCard.viewProfile")}
        </Button>
      </div>
    </div>
  );
}
