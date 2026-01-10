import type { FoundationProfile } from "@/domain/models/FoundationProfile";

export interface IFoundationProfileRepository {
  getFoundationProfile(): Promise<FoundationProfile>;
  updateFoundationProfile(profile: FoundationProfile): Promise<FoundationProfile>;
}
