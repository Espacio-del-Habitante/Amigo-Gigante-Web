import type { IAdoptionRequestRepository } from "@/domain/repositories/IAdoptionRequestRepository";
import type { IAuthRepository } from "@/domain/repositories/IAuthRepository";
import type { IPrivateFileStorage } from "@/domain/repositories/IPrivateFileStorage";

export interface RespondToInfoRequestInput {
  requestId: number;
  message: string;
  files?: File[];
}

const MAX_RESPONSE_FILE_BYTES = 50 * 1024 * 1024;
const ALLOWED_RESPONSE_TYPES = new Set(["video/mp4", "image/jpeg", "image/jpg", "image/png", "application/pdf"]);

export class RespondToInfoRequestUseCase {
  constructor(
    private readonly adoptionRequestRepository: IAdoptionRequestRepository,
    private readonly authRepository: IAuthRepository,
    private readonly fileStorage: IPrivateFileStorage,
  ) {}

  async execute(input: RespondToInfoRequestInput): Promise<void> {
    const session = await this.authRepository.getSession();

    if (!session?.user?.id) {
      throw new Error("errors.unauthorized");
    }

    const accessInfo = await this.adoptionRequestRepository.getRequestAccessInfo({
      requestId: input.requestId,
    });

    if (accessInfo.adopterUserId !== session.user.id) {
      throw new Error("errors.unauthorized");
    }

    const detail = await this.adoptionRequestRepository.getRequestDetail({
      foundationId: accessInfo.foundationId,
      requestId: input.requestId,
    });

    if (detail.status !== "info_requested") {
      throw new Error("errors.invalidStatus");
    }

    if (!input.message.trim()) {
      throw new Error("errors.messageRequired");
    }

    const fileUrls: string[] = [];

    if (input.files && input.files.length > 0) {
      for (const file of input.files) {
        this.validateFile(file);
        const url = await this.fileStorage.uploadFile({
          file,
          foundationId: accessInfo.foundationId,
          requestId: input.requestId,
          type: "adoption-request",
          docType: "response",
        });
        fileUrls.push(url);
      }
    }

    await this.adoptionRequestRepository.saveResponseMessage({
      requestId: input.requestId,
      senderUserId: session.user.id,
      senderRole: "adopter",
      messageText: input.message,
      fileUrls,
    });

    await this.adoptionRequestRepository.updateStatusByAdopter({
      adopterUserId: session.user.id,
      requestId: input.requestId,
      status: "in_review",
    });

    await this.adoptionRequestRepository.notifyFoundationMembers({
      foundationId: accessInfo.foundationId,
      actorUserId: session.user.id,
      title: "Respuesta de información adicional",
      body: "Un adoptante respondió a una solicitud de información adicional.",
      type: "adoption_info_response",
      data: {
        request_id: input.requestId,
        foundation_id: accessInfo.foundationId,
        status: "in_review",
      },
    });
  }

  private validateFile(file: File): void {
    if (file.size > MAX_RESPONSE_FILE_BYTES) {
      throw new Error("errors.fileTooLarge");
    }

    if (!ALLOWED_RESPONSE_TYPES.has(file.type)) {
      throw new Error("errors.invalidFileType");
    }
  }
}
