import type { AnimalManagement } from "@/domain/models/AnimalManagement";

export type DashboardActivityType = "animal" | "event" | "product";

export type DashboardActivityStatus =
  | AnimalManagement["status"]
  | "created"
  | "upcoming"
  | "added";

export interface DashboardActivityItem {
  id: string;
  type: DashboardActivityType;
  title: string;
  subtitle?: string | null;
  date: string; // ISO
  status: DashboardActivityStatus;
}

export interface DashboardKpiTrend {
  percent: number;
  variant: "positive" | "neutral" | "negative";
}

export interface DashboardKpiCard {
  key: "animalsInCare" | "pendingAdoptions";
  value: number;
  trend: DashboardKpiTrend;
}

export interface DashboardAttentionAlert {
  key: "veterinaryReview" | "lowStock" | "volunteersNeeded";
  animalName?: string;
  count?: number;
  dueDate?: string;
  variant: "danger" | "warning" | "neutral";
}

export interface DashboardData {
  foundationId: string;
  foundationName: string;
  kpis: DashboardKpiCard[];
  adoptionFunnel: {
    applicationsReceived: number;
    interviewsScheduled: number;
    homeVisits: number;
    adoptionsCompleted: number;
  };
  recentActivity: DashboardActivityItem[];
  animalsInTreatment: AnimalManagement[];
  attentionAlerts: DashboardAttentionAlert[];
}
