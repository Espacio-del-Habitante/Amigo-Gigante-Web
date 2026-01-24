"use client";

import { Typography } from "@mui/material";
import { useTranslations } from "next-intl";

interface FoundationMessageSectionProps {
  foundationName: string;
  message: string;
}

export function FoundationMessageSection({ foundationName, message }: FoundationMessageSectionProps) {
  const t = useTranslations("answerRequest");

  return (
    <div className="rounded-r-xl border-l-4 border-brand-500 bg-brand-50 p-6">
      <div className="flex items-start gap-3">
        <span className="material-symbols-outlined text-brand-500">info</span>
        <div className="space-y-1">
          <Typography variant="caption" sx={{ fontWeight: 800, letterSpacing: "0.12em" }} className="uppercase">
            {t("foundationMessage.label", { foundationName })}
          </Typography>
          <Typography variant="body1" color="text.primary">
            {message}
          </Typography>
        </div>
      </div>
    </div>
  );
}
