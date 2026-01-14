"use client";

import { useTranslations } from "next-intl";

import type { DashboardActivityItem } from "@/domain/models/DashboardData";

export interface RecentActivityTableProps {
  items: DashboardActivityItem[];
  locale: string;
}

export function RecentActivityTable({ items, locale }: RecentActivityTableProps) {
  const t = useTranslations("dashboard");

  const formatDate = (iso: string): string => {
    const date = new Date(iso);
    if (Number.isNaN(date.getTime())) return iso;

    const now = new Date();
    const startOfToday = new Date(now);
    startOfToday.setHours(0, 0, 0, 0);

    const startOfYesterday = new Date(startOfToday);
    startOfYesterday.setDate(startOfToday.getDate() - 1);

    const startOfTomorrow = new Date(startOfToday);
    startOfTomorrow.setDate(startOfToday.getDate() + 1);

    const time = new Intl.DateTimeFormat(locale, { hour: "2-digit", minute: "2-digit" }).format(date);

    if (date >= startOfToday && date < startOfTomorrow) {
      return t("recentActivity.date.today", { time });
    }

    if (date >= startOfYesterday && date < startOfToday) {
      return t("recentActivity.date.yesterday", { time });
    }

    return new Intl.DateTimeFormat(locale, { day: "2-digit", month: "short", year: "numeric" }).format(date);
  };

  const typeLabel = (type: DashboardActivityItem["type"]) =>
    t(`recentActivity.types.${type}` as never);

  const statusLabel = (item: DashboardActivityItem): string => {
    if (item.type === "animal") return t(`recentActivity.status.animal.${item.status}` as never);
    if (item.type === "event") return t(`recentActivity.status.event.${item.status}` as never);
    return t(`recentActivity.status.product.${item.status}` as never);
  };

  const statusBadgeClass = (item: DashboardActivityItem): string => {
    if (item.type === "animal" && item.status === "in_treatment") {
      return "bg-accent-50 text-accent-700";
    }

    if (item.type === "event" && item.status === "upcoming") {
      return "bg-brand-50 text-brand-700";
    }

    return "bg-neutral-100 text-neutral-600";
  };

  return (
    <section className="overflow-hidden rounded-xl border border-neutral-100 bg-neutral-white shadow-soft">
      <div className="border-b border-neutral-100 p-6">
        <h3 className="text-lg font-extrabold text-neutral-800">{t("recentActivity.title")}</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="bg-neutral-50 text-xs font-bold uppercase text-neutral-500">
            <tr>
              <th className="px-6 py-4">{t("recentActivity.columns.subject")}</th>
              <th className="px-6 py-4">{t("recentActivity.columns.type")}</th>
              <th className="px-6 py-4">{t("recentActivity.columns.date")}</th>
              <th className="px-6 py-4">{t("recentActivity.columns.status")}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {items.map((item) => {
              const initial = item.title.trim().slice(0, 1).toUpperCase();
              return (
                <tr key={item.id} className="transition-colors hover:bg-neutral-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-50 text-xs font-extrabold text-brand-700">
                        {initial || "?"}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate font-extrabold text-neutral-800">{item.title}</p>
                        {item.subtitle ? (
                          <p className="truncate text-xs text-neutral-500">{item.subtitle}</p>
                        ) : null}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-neutral-600">{typeLabel(item.type)}</td>
                  <td className="px-6 py-4 text-neutral-600">{formatDate(item.date)}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-extrabold ${statusBadgeClass(item)}`}>
                      {statusLabel(item)}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}

