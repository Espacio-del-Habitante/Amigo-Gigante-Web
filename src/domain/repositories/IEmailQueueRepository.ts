export interface EnqueueEmailParams {
  userId?: string | null;
  toEmail: string;
  template: string;
  payload: Record<string, unknown>;
}

export interface IEmailQueueRepository {
  enqueue(params: EnqueueEmailParams): Promise<void>;
}
