import type { IAuthRepository } from "@/domain/repositories/IAuthRepository";
import type { INotificationRepository } from "@/domain/repositories/INotificationRepository";

export class MarkNotificationAsReadUseCase {
  constructor(
    private readonly notificationRepository: INotificationRepository,
    private readonly authRepository: IAuthRepository,
  ) {}

  async execute(notificationId: string): Promise<void> {
    const session = await this.authRepository.getSession();

    if (!session?.user?.id) {
      throw new Error("errors.unauthorized");
    }

    await this.notificationRepository.markAsRead(session.user.id, notificationId);
  }
}
