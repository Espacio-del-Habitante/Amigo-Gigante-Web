import type { AnimalManagement } from "@/domain/models/AnimalManagement";
import type { DashboardActivityItem, DashboardData, DashboardKpiCard } from "@/domain/models/DashboardData";
import type { IAnimalRepository } from "@/domain/repositories/IAnimalRepository";
import type { IAuthRepository } from "@/domain/repositories/IAuthRepository";
import type { IEventRepository } from "@/domain/repositories/IEventRepository";
import type { IFoundationMembershipRepository } from "@/domain/repositories/IFoundationMembershipRepository";
import type { IFoundationRepository } from "@/domain/repositories/IFoundationRepository";
import type { IProductRepository } from "@/domain/repositories/IProductRepository";

export class GetDashboardDataUseCase {
  constructor(
    private readonly animalRepository: IAnimalRepository,
    private readonly eventRepository: IEventRepository,
    private readonly productRepository: IProductRepository,
    private readonly authRepository: IAuthRepository,
    private readonly foundationRepository: IFoundationRepository,
    private readonly foundationMembershipRepository: IFoundationMembershipRepository,
  ) {}

  async execute(): Promise<DashboardData> {
    const session = await this.authRepository.getSession();

    if (!session?.user?.id) {
      throw new Error("errors.unauthorized");
    }

    const foundationId = await this.foundationMembershipRepository.getFoundationIdForUser(session.user.id);

    const [
      foundation,
      animalsCount,
      recentAnimals,
      recentEvents,
      recentProducts,
      animalsInTreatment,
    ] = await Promise.all([
      this.foundationRepository.getFoundationById(foundationId),
      this.animalRepository.getAnimalsCount(foundationId),
      this.animalRepository.getRecentAnimals(foundationId, 10),
      this.eventRepository.getRecentEvents(foundationId, 5),
      this.productRepository.getRecentProducts(foundationId, 5),
      this.animalRepository.getAnimalsInTreatment(foundationId),
    ]);

    const kpis: DashboardKpiCard[] = [
      {
        key: "animalsInCare",
        value: animalsCount,
        trend: { percent: 2, variant: "positive" },
      },
      {
        key: "activeSponsorships",
        value: 120,
        trend: { percent: 12, variant: "positive" },
      },
      {
        key: "pendingAdoptions",
        value: 3,
        trend: { percent: 0, variant: "neutral" },
      },
      {
        key: "monthlyRevenue",
        value: 1250,
        trend: { percent: 5, variant: "positive" },
      },
    ];

    const adoptionFunnel = {
      applicationsReceived: 24,
      interviewsScheduled: 12,
      homeVisits: 5,
      adoptionsCompleted: 3,
    };

    const activity = this.buildRecentActivity(recentAnimals, recentEvents, recentProducts);

    const attentionAlerts = this.buildAttentionAlerts(animalsInTreatment);

    return {
      foundationId,
      foundationName: foundation.name,
      kpis,
      adoptionFunnel,
      recentActivity: activity,
      animalsInTreatment,
      attentionAlerts,
    };
  }

  private buildRecentActivity(
    animals: AnimalManagement[],
    events: { id: number; title: string; startsAt: string | null; createdAt: string }[],
    products: { id: number; name: string; createdAt: string }[],
  ): DashboardActivityItem[] {
    const animalItems: DashboardActivityItem[] = animals.map((animal) => ({
      id: `animal-${animal.id}`,
      type: "animal",
      title: animal.name,
      subtitle: animal.breed || null,
      date: animal.createdAt,
      status: animal.status,
    }));

    const eventItems: DashboardActivityItem[] = events.map((event) => ({
      id: `event-${event.id}`,
      type: "event",
      title: event.title,
      subtitle: null,
      date: event.createdAt,
      status: this.getEventStatus(event.startsAt),
    }));

    const productItems: DashboardActivityItem[] = products.map((product) => ({
      id: `product-${product.id}`,
      type: "product",
      title: product.name,
      subtitle: null,
      date: product.createdAt,
      status: "added",
    }));

    const combined = [...animalItems, ...eventItems, ...productItems];

    return combined
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 12);
  }

  private getEventStatus(startsAt: string | null): "upcoming" | "created" {
    if (!startsAt) return "created";
    const date = new Date(startsAt);
    if (Number.isNaN(date.getTime())) return "created";
    return date.getTime() > Date.now() ? "upcoming" : "created";
  }

  private buildAttentionAlerts(animalsInTreatment: AnimalManagement[]): DashboardData["attentionAlerts"] {
    const dueDate = this.getNextWeekdayISO(5); // Friday

    const veterinaryAlerts = animalsInTreatment.slice(0, 3).map((animal) => ({
      key: "veterinaryReview" as const,
      animalName: animal.name,
      dueDate,
      variant: "danger" as const,
    }));

    const mockAlerts: DashboardData["attentionAlerts"] = [
      {
        key: "lowStock",
        count: 5,
        variant: "warning",
      },
      {
        key: "volunteersNeeded",
        count: 2,
        variant: "neutral",
      },
    ];

    return [...veterinaryAlerts, ...mockAlerts];
  }

  private getNextWeekdayISO(targetDay: number): string {
    const now = new Date();
    const current = now.getDay(); // 0=Sun..6=Sat
    const delta = (targetDay - current + 7) % 7 || 7;
    const next = new Date(now);
    next.setDate(now.getDate() + delta);
    next.setHours(0, 0, 0, 0);
    return next.toISOString();
  }
}

