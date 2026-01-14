export interface IFoundationMembershipRepository {
  getFoundationIdForUser(userId: string): Promise<string>;
}

