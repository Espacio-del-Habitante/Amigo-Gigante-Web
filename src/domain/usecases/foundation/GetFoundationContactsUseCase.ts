import type { FoundationContact } from "@/domain/models/FoundationContact";
import type { IFoundationRepository } from "@/domain/repositories/IFoundationRepository";

export interface GetFoundationContactsInput {
  foundationId: string;
}

export class GetFoundationContactsUseCase {
  constructor(private readonly foundationRepository: IFoundationRepository) {}

  async execute(input: GetFoundationContactsInput): Promise<FoundationContact> {
    const foundationId = input.foundationId?.trim();
    if (!foundationId) {
      throw new Error("errors.notFound");
    }

    return this.foundationRepository.getFoundationContacts(foundationId);
  }
}
