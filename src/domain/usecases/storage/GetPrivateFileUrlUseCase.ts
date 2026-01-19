import type { IAdoptionRequestRepository } from "@/domain/repositories/IAdoptionRequestRepository";
import type { IAuthRepository } from "@/domain/repositories/IAuthRepository";
import type { IFoundationMembershipRepository } from "@/domain/repositories/IFoundationMembershipRepository";
import type { IPrivateFileStorage, GetPrivateFileUrlParams } from "@/domain/repositories/IPrivateFileStorage";

const DEFAULT_EXPIRES_IN = 3600;

interface FilePathAccessInfo {
  foundationId: string;
  requestId: number;
}

export class GetPrivateFileUrlUseCase {
  constructor(
    private readonly privateFileStorage: IPrivateFileStorage,
    private readonly authRepository: IAuthRepository,
    private readonly adoptionRequestRepository: IAdoptionRequestRepository,
    private readonly foundationMembershipRepository: IFoundationMembershipRepository,
  ) {}

  async execute(params: GetPrivateFileUrlParams): Promise<string> {
    const session = await this.authRepository.getSession();

    if (!session?.user?.id) {
      throw new Error("storage.private.upload.error.accessDenied");
    }

    try {
      const accessInfo = this.parseAccessInfo(params.filePath);
      const requestAccess = await this.adoptionRequestRepository.getRequestAccessInfo({
        requestId: accessInfo.requestId,
      });

      if (session.user.role === "external") {
        if (requestAccess.adopterUserId !== session.user.id) {
          throw new Error("storage.private.upload.error.accessDenied");
        }
      } else if (session.user.role === "foundation_user" || session.user.role === "admin") {
        const foundationId = await this.foundationMembershipRepository.getFoundationIdForUser(session.user.id);
        if (foundationId !== requestAccess.foundationId || foundationId !== accessInfo.foundationId) {
          throw new Error("storage.private.upload.error.accessDenied");
        }
      } else {
        throw new Error("storage.private.upload.error.accessDenied");
      }
    } catch (error) {
      throw new Error(this.normalizeAccessError(error));
    }

    return this.privateFileStorage.getSignedUrl({
      filePath: params.filePath,
      expiresIn: params.expiresIn ?? DEFAULT_EXPIRES_IN,
    });
  }

  private parseAccessInfo(filePath: string): FilePathAccessInfo {
    const parts = filePath.split("/").filter(Boolean);

    if (parts.length < 4 || parts[0] !== "adoption-requests") {
      throw new Error("storage.private.url.error.generating");
    }

    const foundationId = parts[1];
    const requestId = Number(parts[2]);

    if (!foundationId || !Number.isFinite(requestId)) {
      throw new Error("storage.private.url.error.generating");
    }

    return {
      foundationId,
      requestId,
    };
  }

  private normalizeAccessError(error: unknown): string {
    if (error instanceof Error && error.message.startsWith("storage.")) {
      return error.message;
    }

    if (error instanceof Error) {
      if (error.message === "errors.unauthorized") {
        return "storage.private.upload.error.accessDenied";
      }

      if (error.message === "errors.connection") {
        return "storage.private.connection";
      }

      if (error.message === "errors.notFound") {
        return "storage.private.upload.error.accessDenied";
      }
    }

    return "storage.private.url.error.generating";
  }
}
