import type { useTranslations } from "next-intl";
import * as Yup from "yup";

import type { AnimalManagementSex, AnimalManagementSpecies, AnimalManagementStatus } from "@/domain/models/AnimalManagement";
import type { AddAnimalAgeUnit, AddAnimalSize } from "@/domain/usecases/animals/CreateAnimalUseCase";

export type AddAnimalSubmissionType = "draft" | "publish";

export interface AddAnimalFormValues {
  name: string;
  breed: string;
  species: AnimalManagementSpecies | "";
  age: number | "";
  ageUnit: AddAnimalAgeUnit;
  gender: AnimalManagementSex | "unknown";
  size: AddAnimalSize | "unknown";
  currentLocation: string;
  description: string;
  status: AnimalManagementStatus | "";
  healthStatus: {
    vaccinated: boolean;
    spayedNeutered: boolean;
    wormed: boolean;
  };
  photos: string[];
  submissionType: AddAnimalSubmissionType;
}

type AnimalsTranslator = ReturnType<typeof useTranslations>;

export const createAddAnimalValidationSchema = (t: AnimalsTranslator) =>
  Yup.object().shape({
    name: Yup.string().trim().required(t("add.validation.nameRequired")),
    breed: Yup.string().trim().notRequired(),
    species: Yup.string()
      .oneOf(["dog", "cat", "bird", "other"], t("add.validation.speciesRequired"))
      .required(t("add.validation.speciesRequired")),
    age: Yup.number()
      .typeError(t("add.validation.ageRequired"))
      .required(t("add.validation.ageRequired"))
      .integer(t("add.validation.ageInteger"))
      .min(0, t("add.validation.ageMin")),
    ageUnit: Yup.string()
      .oneOf(["years", "months"], t("add.validation.ageUnitInvalid"))
      .required(t("add.validation.ageUnitInvalid")),
    gender: Yup.string()
      .oneOf(["male", "female"], t("add.validation.genderRequired"))
      .required(t("add.validation.genderRequired")),
    size: Yup.string().oneOf(["small", "medium", "large", "giant", "unknown"]).notRequired(),
    currentLocation: Yup.string().trim().notRequired(),
    description: Yup.string()
      .trim()
      .required(t("add.validation.descriptionRequired"))
      .min(100, t("add.validation.descriptionMin")),
    status: Yup.string()
      .oneOf(["available", "inactive", "in_treatment", "pending", "adopted"], t("add.validation.statusRequired"))
      .required(t("add.validation.statusRequired")),
    healthStatus: Yup.object().shape({
      vaccinated: Yup.boolean().notRequired(),
      spayedNeutered: Yup.boolean().notRequired(),
      wormed: Yup.boolean().notRequired(),
    }),
    photos: Yup.array()
      .of(Yup.string().trim().required())
      .max(10, t("add.validation.photosMax"))
      .when("submissionType", {
        is: "publish",
        then: (schema) => schema.min(1, t("add.validation.photosMin")),
        otherwise: (schema) => schema.notRequired(),
      }),
    submissionType: Yup.string().oneOf(["draft", "publish"]).required(),
  });

