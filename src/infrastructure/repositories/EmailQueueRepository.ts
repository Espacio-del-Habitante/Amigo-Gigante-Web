import type {
  EnqueueEmailParams,
  IEmailQueueRepository,
} from "@/domain/repositories/IEmailQueueRepository";
import { supabaseClient } from "@/infrastructure/config/supabase";

/**
 * Inserta en la tabla existente `email_queue` (db.sql L206-223).
 * Columnas usadas: user_id, to_email, template, payload.
 * status/attempts/created_at tienen default en BD.
 */
export class EmailQueueRepository implements IEmailQueueRepository {
  async enqueue(params: EnqueueEmailParams): Promise<void> {
    const { error } = await supabaseClient.from("email_queue").insert({
      user_id: params.userId ?? null,
      to_email: params.toEmail,
      template: params.template,
      payload: params.payload as Record<string, unknown>,
    });

    if (error) {
      throw new Error("errors.emailQueueEnqueue");
    }
  }
}
