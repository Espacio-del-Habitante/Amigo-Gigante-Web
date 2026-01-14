"use client";

import { useTranslations } from "next-intl";

export interface AdoptionFunnelSectionProps {
  funnel: {
    applicationsReceived: number;
    interviewsScheduled: number;
    homeVisits: number;
    adoptionsCompleted: number;
  };
}

export function AdoptionFunnelSection({ funnel }: AdoptionFunnelSectionProps) {
  const t = useTranslations("dashboard");

  const total = Math.max(1, funnel.applicationsReceived);
  const pct = (value: number) => Math.min(100, Math.round((value / total) * 100));

  const rows = [
    {
      key: "applicationsReceived",
      label: t("adoptionFunnel.applicationsReceived"),
      value: funnel.applicationsReceived,
      percent: 100,
      barClassName: "bg-neutral-300",
    },
    {
      key: "interviewsScheduled",
      label: t("adoptionFunnel.interviewsScheduled"),
      value: funnel.interviewsScheduled,
      percent: pct(funnel.interviewsScheduled),
      barClassName: "bg-brand-500/60",
    },
    {
      key: "homeVisits",
      label: t("adoptionFunnel.homeVisits"),
      value: funnel.homeVisits,
      percent: pct(funnel.homeVisits),
      barClassName: "bg-brand-500/80",
    },
    {
      key: "adoptionsCompleted",
      label: t("adoptionFunnel.adoptionsCompleted"),
      value: funnel.adoptionsCompleted,
      percent: pct(funnel.adoptionsCompleted),
      barClassName: "bg-brand-500",
    },
  ];

  return (
    <section className="overflow-hidden rounded-xl border border-neutral-100 bg-neutral-white shadow-soft">
      <div className="flex items-center justify-between border-b border-neutral-100 p-6">
        <h3 className="text-lg font-extrabold text-neutral-800">{t("adoptionFunnel.title")}</h3>
        <button type="button" className="text-sm font-bold text-brand-500 hover:text-brand-600">
          {t("adoptionFunnel.viewReport")}
        </button>
      </div>
      <div className="flex flex-col gap-5 p-6">
        {rows.map((row) => (
          <div key={row.key} className="flex flex-col gap-1">
            <div className="flex items-center justify-between text-sm font-medium">
              <span className="text-neutral-700">{row.label}</span>
              <span className="font-extrabold text-neutral-800">{row.value}</span>
            </div>
            <div className="h-3 w-full overflow-hidden rounded-full bg-neutral-100">
              <div className={`h-full rounded-full ${row.barClassName}`} style={{ width: `${row.percent}%` }} />
            </div>
          </div>
        ))}
        <div className="mt-2 flex gap-4">
          <div className="flex items-center gap-2 text-sm text-neutral-500">
            <div className="h-2 w-2 rounded-full bg-brand-500" />
            <span>{t("adoptionFunnel.legend.inProcess")}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-neutral-500">
            <div className="h-2 w-2 rounded-full bg-neutral-300" />
            <span>{t("adoptionFunnel.legend.totalInput")}</span>
          </div>
        </div>
      </div>
    </section>
  );
}

