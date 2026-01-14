import type { IEventRepository, RecentEvent } from "@/domain/repositories/IEventRepository";
import { supabaseClient } from "@/infrastructure/config/supabase";

interface EventRow {
  id: number;
  title: string | null;
  starts_at: string | null;
  created_at: string;
}

export class EventRepository implements IEventRepository {
  async getRecentEvents(foundationId: string, limit: number): Promise<RecentEvent[]> {
    const { data, error } = await supabaseClient
      .from("events")
      .select("id, title, starts_at, created_at")
      .eq("foundation_id", foundationId)
      .order("created_at", { ascending: false })
      .limit(limit)
      .returns<EventRow[]>();

    if (error) {
      throw new Error(this.translateEventsError(error));
    }

    return (data ?? []).map((row) => ({
      id: row.id,
      title: row.title ?? "",
      startsAt: row.starts_at ?? null,
      createdAt: row.created_at,
    }));
  }

  private translateEventsError(error: { message?: string }): string {
    const message = error.message?.toLowerCase?.() ?? "";

    if (message.includes("permission") || message.includes("row level")) {
      return "errors.unauthorized";
    }

    if (message.includes("connection") || message.includes("network")) {
      return "errors.connection";
    }

    return "errors.generic";
  }
}

