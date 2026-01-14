"use client";

import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import PaymentsRoundedIcon from "@mui/icons-material/PaymentsRounded";
import PetsRoundedIcon from "@mui/icons-material/PetsRounded";
import type { ReactNode } from "react";

import type { DashboardKpiCard } from "@/domain/models/DashboardData";
import { DashboardKPICard } from "@/presentation/components/dashboard/DashboardKPICard";

export interface DashboardKPICardsProps {
  kpis: DashboardKpiCard[];
  locale: string;
}

export function DashboardKPICards({ kpis, locale }: DashboardKPICardsProps) {
  const icons: Record<DashboardKpiCard["key"], { icon: ReactNode; iconClassName: string }> = {
    animalsInCare: {
      icon: <PetsRoundedIcon fontSize="small" />,
      iconClassName: "bg-brand-50 text-brand-700",
    },
    activeSponsorships: {
      icon: <FavoriteRoundedIcon fontSize="small" />,
      iconClassName: "bg-accent-50 text-accent-700",
    },
    pendingAdoptions: {
      icon: <HomeRoundedIcon fontSize="small" />,
      iconClassName: "bg-neutral-100 text-neutral-700",
    },
    monthlyRevenue: {
      icon: <PaymentsRoundedIcon fontSize="small" />,
      iconClassName: "bg-brand-50 text-brand-700",
    },
  };

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
      {kpis.map((kpi) => (
        <DashboardKPICard
          key={kpi.key}
          kpi={kpi}
          locale={locale}
          icon={icons[kpi.key].icon}
          iconClassName={icons[kpi.key].iconClassName}
        />
      ))}
    </div>
  );
}

