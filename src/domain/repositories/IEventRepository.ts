export interface RecentEvent {
  id: number;
  title: string;
  startsAt: string | null;
  createdAt: string;
}

export interface IEventRepository {
  getRecentEvents(foundationId: string, limit: number): Promise<RecentEvent[]>;
}

