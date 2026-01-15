import type { Foundation } from "@/domain/models/Foundation";
import type { FoundationContact } from "@/domain/models/FoundationContact";
import type { ShopFoundation } from "@/domain/models/ShopFoundation";

export type FoundationMemberRole = "owner" | "editor";

export interface CreateFoundationParams {
  name: string;
  taxId?: string;
}

export interface CreateFoundationContactParams {
  foundationId: string;
  officialEmail: string;
  taxId?: string;
}

export interface CreateFoundationMemberParams {
  foundationId: string;
  userId: string;
  memberRole: FoundationMemberRole;
}

export interface IFoundationRepository {
  createFoundation(params: CreateFoundationParams): Promise<Foundation>;
  createFoundationContact(params: CreateFoundationContactParams): Promise<void>;
  createFoundationMember(params: CreateFoundationMemberParams): Promise<void>;
  getFoundationById(foundationId: string): Promise<Foundation>;
  getFoundationsList(): Promise<ShopFoundation[]>;
  getFoundationContacts(foundationId: string): Promise<FoundationContact>;
  rollbackFoundation(foundationId: string): Promise<void>;
}
