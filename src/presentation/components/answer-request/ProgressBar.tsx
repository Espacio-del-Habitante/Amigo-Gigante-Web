"use client";

import { Typography } from "@mui/material";
import { useTranslations } from "next-intl";

import type { AdoptionRequestStatus } from "@/domain/models/AdoptionRequest";

interface ProgressBarProps {
  status: AdoptionRequestStatus;
}

const STEP_KEYS = ["initial", "interview", "additionalInfo", "homeVisit", "approval"] as const;

const STATUS_STEP_MAP: Record<AdoptionRequestStatus, number> = {
  pending: 1,
  in_review: 2,
  info_requested: 3,
  preapproved: 4,
  approved: 5,
  completed: 5,
  rejected: 1,
  cancelled: 1,
};

export function ProgressBar({ status }: ProgressBarProps) {
  const t = useTranslations("answerRequest");
  const currentStep = STATUS_STEP_MAP[status] ?? 1;
  const totalSteps = STEP_KEYS.length;
  const percentage = Math.round((currentStep / totalSteps) * 100);

  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-soft">
      <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
        {t("progress.title")}
      </Typography>
      <div className="mt-4 space-y-4">
        <div className="flex items-center justify-between text-[11px] font-bold uppercase text-neutral-400">
          <span>{t("progress.step", { current: currentStep, total: totalSteps })}</span>
          <span>{t("progress.percentage", { percentage })}</span>
        </div>
        <div className="h-2 w-full rounded-full bg-neutral-100">
          <div className="h-full rounded-full bg-brand-500" style={{ width: `${percentage}%` }} />
        </div>
        <ul className="space-y-2 text-xs">
          {STEP_KEYS.map((key, index) => {
            const stepIndex = index + 1;
            const isCompleted = stepIndex < currentStep;
            const isCurrent = stepIndex === currentStep;
            const textClass = isCompleted
              ? "text-emerald-600"
              : isCurrent
                ? "text-brand-500 font-semibold"
                : "text-neutral-400";
            const icon = isCompleted ? "check_circle" : isCurrent ? "radio_button_checked" : "circle";

            return (
              <li key={key} className={`flex items-center gap-2 ${textClass}`}>
                <span className={`material-symbols-outlined text-sm ${isCurrent ? "animate-pulse" : ""}`}>{icon}</span>
                <span>{t(`progress.steps.${key}`)}</span>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
