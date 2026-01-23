import type { AnimalManagement } from "@/domain/models/AnimalManagement";
import type { DashboardActivityItem, DashboardData, DashboardKpiCard } from "@/domain/models/DashboardData";
import type { IAnimalRepository } from "@/domain/repositories/IAnimalRepository";
import type { IAdoptionRequestRepository } from "@/domain/repositories/IAdoptionRequestRepository";
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
    private readonly adoptionRequestRepository: IAdoptionRequestRepository,
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
      adoptionCounts,
    ] = await Promise.all([
      this.foundationRepository.getFoundationById(foundationId),
      this.animalRepository.getAnimalsCount(foundationId),
      this.animalRepository.getRecentAnimals(foundationId, 10),
      this.eventRepository.getRecentEvents(foundationId, 5),
      this.productRepository.getRecentProducts(foundationId, 5),
      this.animalRepository.getAnimalsInTreatment(foundationId),
      this.adoptionRequestRepository.getAdoptionRequestsCounts({ foundationId }),
    ]);

    const kpis: DashboardKpiCard[] = [
      {
        key: "animalsInCare",
        value: animalsCount,
        trend: { percent: 0, variant: "neutral" },
      },
      {
        key: "pendingAdoptions",
        value: adoptionCounts.byStatus.pending,
        trend: { percent: 0, variant: "neutral" },
      },
    ];

    const adoptionFunnel = {
      applicationsReceived: adoptionCounts.total,
      interviewsScheduled: adoptionCounts.byStatus.preapproved,
      homeVisits: adoptionCounts.byStatus.preapproved,
      adoptionsCompleted: adoptionCounts.byStatus.completed,
    };

    const activity = this.buildRecentActivity(recentAnimals, recentEvents, recentProducts);

    const attentionAlerts: DashboardData["attentionAlerts"] = [];

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
}
