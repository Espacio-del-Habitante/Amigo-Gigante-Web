export type AdoptWizardStep = 1 | 2 | 3 | 4;

export type HousingTypeOption = "house" | "apartment" | "other" | "";

export interface AdoptFormValues {
  adopterDisplayName: string;
  adopterEmail: string;
  adopterPhone: string;
  city: string;
  neighborhood: string;
  housingType: HousingTypeOption;
  isRent: boolean;
  allowsPets: boolean;
  householdPeopleCount: string;
  childrenAges: string;
  otherPetsDescription: string;
  hoursAlonePerDay: string;
  travelPlan: string;
  experienceText: string;
  motivationText: string;
  idDocument: File | null;
  homePhotos: File[];
  acceptsVetCosts: boolean;
  acceptsLifetimeCommitment: boolean;
}

export type AdoptFormErrors = Partial<Record<keyof AdoptFormValues, string>>;
