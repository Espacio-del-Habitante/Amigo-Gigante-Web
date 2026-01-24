import type { IAuthRepository } from "@/domain/repositories/IAuthRepository";
import type {
  CreateFoundationContactParams,
  CreateFoundationMemberParams,
  CreateFoundationParams,
  IFoundationRepository,
} from "@/domain/repositories/IFoundationRepository";
import type { Foundation } from "@/domain/models/Foundation";
import type { AuthSession, AuthUser } from "@/domain/types/auth.types";

export interface RegisterFoundationInput {
  foundationName: string;
  officialEmail: string;
  password: string;
  taxId?: string;
}

export interface RegisterFoundationResult {
  user: AuthUser;
  foundation: Foundation;
  session: AuthSession | null;
}

export class RegisterFoundationUseCase {
  constructor(
    private readonly authRepository: IAuthRepository,
    private readonly foundationRepository: IFoundationRepository,
  ) {}

  async execute(input: RegisterFoundationInput): Promise<RegisterFoundationResult> {
    const { foundationName, officialEmail, password, taxId } = input;

    const { user, session } = await this.authRepository.signUp({
      email: officialEmail,
      password,
    });

    let foundation: Foundation | null = null;

    try {
      await this.authRepository.createProfile({
        userId: user.id,
        role: "foundation_user",
      });

      foundation = await this.foundationRepository.createFoundation(
        this.buildFoundationPayload(foundationName, taxId),
      );

      // Crear el miembro ANTES del contacto para que la política RLS permita la inserción
      await this.foundationRepository.createFoundationMember(
        this.buildMemberPayload(foundation.id, user.id),
      );

      await this.foundationRepository.createFoundationContact(
        this.buildContactPayload(foundation.id, officialEmail, taxId),
      );

      return {
        user,
        foundation,
        session,
      };
    } catch (error) {
      if (foundation) {
        await this.foundationRepository.rollbackFoundation(foundation.id);
      }

      const message =
        error instanceof Error
          ? error.message
          : "No se pudo completar el registro de la fundación. Inténtalo nuevamente.";

      throw new Error(message);
    }
  }

  private buildFoundationPayload(name: string, taxId?: string): CreateFoundationParams {
    return {
      name,
      taxId,
    };
  }

  private buildContactPayload(
    foundationId: string,
    officialEmail: string,
    taxId?: string,
  ): CreateFoundationContactParams {
    return {
      foundationId,
      officialEmail,
      taxId,
    };
  }

  private buildMemberPayload(foundationId: string, userId: string): CreateFoundationMemberParams {
    return {
      foundationId,
      userId,
      memberRole: "owner",
    };
  }
}
