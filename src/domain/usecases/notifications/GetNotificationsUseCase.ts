import type { Notification } from "@/domain/models/Notification";
import type { INotificationRepository } from "@/domain/repositories/INotificationRepository";
import type { IAuthRepository } from "@/domain/repositories/IAuthRepository";

export class GetNotificationsUseCase {
  constructor(
    private readonly notificationRepository: INotificationRepository,
    private readonly authRepository: IAuthRepository,
  ) {}

  async execute(limit = 15): Promise<Notification[]> {
    const session = await this.authRepository.getSession();

    if (!session?.user?.id) {
      throw new Error("errors.unauthorized");
    }

    return this.notificationRepository.getNotifications(session.user.id, limit);
  }
}
