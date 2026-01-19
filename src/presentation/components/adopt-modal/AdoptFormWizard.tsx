"use client";

import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import PetsRoundedIcon from "@mui/icons-material/PetsRounded";
import {
  Alert,
  Box,
  CircularProgress,
  Divider,
  Typography,
} from "@mui/material";
import { useTranslations } from "next-intl";
import { useCallback, useMemo, useState } from "react";

import type { AdoptionRequestDetails } from "@/domain/models/AdoptionRequest";
import { CreateAdoptionRequestUseCase } from "@/domain/usecases/adopt/CreateAdoptionRequestUseCase";
import { appContainer } from "@/infrastructure/ioc/container";
import { USE_CASE_TYPES } from "@/infrastructure/ioc/usecases/usecases.types";
import { Button } from "@/presentation/components/atoms";
import { useAuth } from "@/presentation/hooks/useAuth";

import { AdoptStepBasic } from "./AdoptStepBasic";
import { AdoptStepDocs } from "./AdoptStepDocs";
import { AdoptStepHome } from "./AdoptStepHome";
import { AdoptStepStyle } from "./AdoptStepStyle";
import type { AdoptFormErrors, AdoptFormValues, AdoptWizardStep } from "./adoptFormTypes";

const MAX_DOC_SIZE_BYTES = 10 * 1024 * 1024;
const MAX_HOME_PHOTOS = 5;
const ALLOWED_ID_TYPES = new Set([
  "application/pdf",
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/gif",
  "image/webp",
]);
const ALLOWED_PHOTO_TYPES = new Set(["image/png", "image/jpeg", "image/jpg", "image/gif", "image/webp"]);

interface AdoptFormWizardProps {
  animalId: number;
  foundationId: string;
  animalName: string;
  onClose: () => void;
}

export function AdoptFormWizard({ animalId, foundationId, animalName, onClose }: AdoptFormWizardProps) {
  const t = useTranslations("adoptRequest");
  const tStorage = useTranslations("storage");
  const { isAuthenticated, loading: isAuthLoading } = useAuth();

  const createAdoptionRequestUseCase = useMemo(
    () => appContainer.get<CreateAdoptionRequestUseCase>(USE_CASE_TYPES.CreateAdoptionRequestUseCase),
    [],
  );

  const [step, setStep] = useState<AdoptWizardStep>(1);
  const [values, setValues] = useState<AdoptFormValues>({
    adopterDisplayName: "",
    adopterEmail: "",
    adopterPhone: "",
    city: "",
    neighborhood: "",
    housingType: "",
    isRent: false,
    allowsPets: false,
    householdPeopleCount: "",
    childrenAges: "",
    otherPetsDescription: "",
    hoursAlonePerDay: "",
    travelPlan: "",
    experienceText: "",
    motivationText: "",
    idDocument: null,
    homePhotos: [],
    acceptsVetCosts: false,
    acceptsLifetimeCommitment: false,
  });
  const [errors, setErrors] = useState<AdoptFormErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const steps = useMemo(
    () => [
      { step: 1, label: t("form.steps.basic") },
      { step: 2, label: t("form.steps.home") },
      { step: 3, label: t("form.steps.style") },
      { step: 4, label: t("form.steps.docs") },
    ],
    [t],
  );

  const setFieldValue = useCallback(
    (field: keyof AdoptFormValues, value: AdoptFormValues[keyof AdoptFormValues]) => {
      setValues((prev) => ({ ...prev, [field]: value }));
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    },
    [],
  );

  const normalizeNumber = (value: string) => {
    if (!value.trim()) return null;
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  };

  const validateStep = useCallback(
    (currentStep: AdoptWizardStep): AdoptFormErrors => {
      const nextErrors: AdoptFormErrors = {};

      if (currentStep === 1) {
        if (!values.adopterDisplayName.trim()) nextErrors.adopterDisplayName = t("form.errors.required");
        if (!values.adopterEmail.trim()) {
          nextErrors.adopterEmail = t("form.errors.required");
        } else if (!/^\S+@\S+\.\S+$/.test(values.adopterEmail.trim())) {
          nextErrors.adopterEmail = t("form.errors.email");
        }
        if (!values.adopterPhone.trim()) nextErrors.adopterPhone = t("form.errors.required");
        if (!values.city.trim()) nextErrors.city = t("form.errors.required");
        if (!values.neighborhood.trim()) nextErrors.neighborhood = t("form.errors.required");
      }

      if (currentStep === 2) {
        if (!values.housingType) nextErrors.housingType = t("form.errors.required");
        const people = normalizeNumber(values.householdPeopleCount);
        if (values.householdPeopleCount && people === null) {
          nextErrors.householdPeopleCount = t("form.errors.numeric");
        }
      }

      if (currentStep === 3) {
        const hours = normalizeNumber(values.hoursAlonePerDay);
        if (values.hoursAlonePerDay && hours === null) {
          nextErrors.hoursAlonePerDay = t("form.errors.numeric");
        }
      }

      if (currentStep === 4) {
        if (!values.idDocument) nextErrors.idDocument = t("form.errors.required");
        if (values.homePhotos.length === 0) nextErrors.homePhotos = t("form.errors.required");
        if (!values.acceptsVetCosts) nextErrors.acceptsVetCosts = t("form.errors.required");
        if (!values.acceptsLifetimeCommitment) nextErrors.acceptsLifetimeCommitment = t("form.errors.required");
      }

      return nextErrors;
    },
    [normalizeNumber, t, values],
  );

  const handleNext = () => {
    const nextErrors = validateStep(step);
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }
    setStep((prev) => (prev < 4 ? ((prev + 1) as AdoptWizardStep) : prev));
  };

  const handleBack = () => {
    setStep((prev) => (prev > 1 ? ((prev - 1) as AdoptWizardStep) : prev));
  };

  const handleIdDocumentChange = (file: File | null) => {
    if (!file) {
      setFieldValue("idDocument", null);
      return;
    }

    if (file.size > MAX_DOC_SIZE_BYTES) {
      setErrors((prev) => ({
        ...prev,
        idDocument: tStorage("private.validation.maxSize"),
      }));
      return;
    }

    if (!ALLOWED_ID_TYPES.has(file.type)) {
      setErrors((prev) => ({
        ...prev,
        idDocument: tStorage("private.validation.invalidType"),
      }));
      return;
    }

    setFieldValue("idDocument", file);
  };

  const handleAddHomePhotos = (files: File[]) => {
    if (files.length === 0) return;

    const currentCount = values.homePhotos.length;
    if (currentCount >= MAX_HOME_PHOTOS) {
      setErrors((prev) => ({ ...prev, homePhotos: t("form.docs.errors.tooMany") }));
      return;
    }

    let hasTooLarge = false;
    let hasInvalidType = false;

    const allowedFiles = files.filter((file) => {
      if (file.size > MAX_DOC_SIZE_BYTES) {
        hasTooLarge = true;
        return false;
      }
      if (!ALLOWED_PHOTO_TYPES.has(file.type)) {
        hasInvalidType = true;
        return false;
      }
      return true;
    });

    if (hasTooLarge) {
      setErrors((prev) => ({ ...prev, homePhotos: tStorage("private.validation.maxSize") }));
    } else if (hasInvalidType) {
      setErrors((prev) => ({ ...prev, homePhotos: tStorage("private.validation.invalidType") }));
    }

    const remaining = Math.max(0, MAX_HOME_PHOTOS - currentCount);
    const nextFiles = allowedFiles.slice(0, remaining);
    if (nextFiles.length === 0) return;

    const exceeded = allowedFiles.length > remaining;
    if (exceeded) {
      setErrors((prev) => ({ ...prev, homePhotos: t("form.docs.errors.tooMany") }));
    }

    setFieldValue("homePhotos", [...values.homePhotos, ...nextFiles]);
  };

  const handleRemoveHomePhoto = (index: number) => {
    const next = values.homePhotos.filter((_, idx) => idx !== index);
    setFieldValue("homePhotos", next);
  };

  const handleSubmit = async () => {
    setSubmitError(null);
    const nextErrors = validateStep(4);
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    if (!animalId || !foundationId) {
      setSubmitError(t("errors.generic"));
      return;
    }

    if (!isAuthenticated) {
      setSubmitError(t("errors.unauthenticated"));
      return;
    }

    const details: AdoptionRequestDetails = {
      adopterDisplayName: values.adopterDisplayName.trim(),
      adopterEmail: values.adopterEmail.trim(),
      adopterPhone: values.adopterPhone.trim(),
      city: values.city.trim(),
      neighborhood: values.neighborhood.trim(),
      housingType: values.housingType || null,
      isRent: values.isRent,
      allowsPets: values.allowsPets,
      householdPeopleCount: normalizeNumber(values.householdPeopleCount),
      hasChildren: values.childrenAges.trim().length > 0,
      childrenAges: values.childrenAges.trim() || null,
      hasOtherPets: values.otherPetsDescription.trim().length > 0,
      otherPetsDescription: values.otherPetsDescription.trim() || null,
      hoursAlonePerDay: normalizeNumber(values.hoursAlonePerDay),
      travelPlan: values.travelPlan.trim() || null,
      experienceText: values.experienceText.trim() || null,
      motivationText: values.motivationText.trim() || null,
      acceptsVetCosts: values.acceptsVetCosts,
      acceptsLifetimeCommitment: values.acceptsLifetimeCommitment,
    };

    if (!values.idDocument) {
      setSubmitError(t("errors.documentsRequired"));
      return;
    }

    try {
      setIsSubmitting(true);
      await createAdoptionRequestUseCase.execute({
        animalId,
        foundationId,
        details,
        documents: {
          idDocument: values.idDocument,
          homePhotos: values.homePhotos,
        },
      });

      onClose();
    } catch (error) {
      if (error instanceof Error && error.message) {
        const key = error.message;
        if (key.startsWith("storage.")) {
          setSubmitError(tStorage(key.replace(/^storage\./, "")));
          return;
        }
        const errorKeys = [
          "errors.unauthenticated",
          "errors.unauthorized",
          "errors.connection",
          "errors.storageUnavailable",
          "errors.documentsRequired",
          "errors.duplicate",
          "errors.generic",
        ] as const;
        const isErrorKey = (value: string): value is (typeof errorKeys)[number] =>
          (errorKeys as readonly string[]).includes(value);

        setSubmitError(isErrorKey(key) ? t(key) : key);
      } else {
        setSubmitError(t("errors.generic"));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const activeStepLabel = steps.find((item) => item.step === step)?.label ?? "";

  return (
    <Box className="flex flex-col gap-6">
      <Box className="text-center">
        <Typography variant="h5" sx={{ fontWeight: 900 }} className="text-neutral-900">
          {t("form.title")}
        </Typography>
        <Typography variant="body2" color="text.secondary" className="mt-2">
          {t("form.subtitle", { animal: animalName })}
        </Typography>
      </Box>

      <Box className="flex items-center justify-center px-2 text-xs md:text-sm">
        {steps.map((item, index) => {
          const isCompleted = step > item.step;
          const isActive = step === item.step;
          return (
            <Box key={item.step} className="flex items-center">
              <Box className="flex flex-col items-center gap-1 md:gap-2 min-w-0">
                <Box
                  className={`flex h-8 w-8 md:h-10 md:w-10 items-center justify-center rounded-full text-xs font-bold shrink-0 ${
                    isActive || isCompleted ? "bg-brand-500 text-neutral-50" : "bg-neutral-100 text-neutral-400"
                  }`}
                >
                  {isCompleted ? <CheckRoundedIcon fontSize="small" /> : item.step}
                </Box>
                <Typography
                  variant="caption"
                  className={`hidden md:block text-center whitespace-nowrap ${isActive ? "text-brand-500 font-bold" : "text-neutral-400"}`}
                >
                  {item.label}
                </Typography>
              </Box>
              {index < steps.length - 1 ? (
                <Box
                  className={`mx-1 md:mx-2 h-1 w-8 md:w-12 lg:w-16 rounded-full shrink-0 ${
                    step > item.step ? "bg-brand-500" : "bg-neutral-100"
                  }`}
                />
              ) : null}
            </Box>
          );
        })}
      </Box>

      <Box className="rounded-2xl border border-neutral-100 bg-white shadow-soft">
        <Box className="p-6 md:p-8">
          <Typography variant="subtitle1" sx={{ fontWeight: 800 }} className="mb-4">
            {activeStepLabel}
          </Typography>

          {submitError ? (
            <Alert severity="error" className="mb-4">
              {submitError}
            </Alert>
          ) : null}

          {!isAuthLoading && !isAuthenticated ? (
            <Alert severity="warning" className="mb-4">
              {t("states.authRequired")}
            </Alert>
          ) : null}

          {step === 1 ? (
            <AdoptStepBasic values={values} errors={errors} disabled={isSubmitting} onChange={setFieldValue} />
          ) : null}
          {step === 2 ? (
            <AdoptStepHome values={values} errors={errors} disabled={isSubmitting} onChange={setFieldValue} />
          ) : null}
          {step === 3 ? (
            <AdoptStepStyle values={values} errors={errors} disabled={isSubmitting} onChange={setFieldValue} />
          ) : null}
          {step === 4 ? (
            <AdoptStepDocs
              values={values}
              errors={errors}
              disabled={isSubmitting}
              onIdDocumentChange={handleIdDocumentChange}
              onAddHomePhotos={handleAddHomePhotos}
              onRemoveHomePhoto={handleRemoveHomePhoto}
              onToggle={(field, value) => setFieldValue(field, value)}
            />
          ) : null}
        </Box>

        <Divider />
        <Box className="flex flex-col gap-3 px-6 py-4 md:flex-row md:items-center md:justify-between">
          <Button
            variant="ghost"
            tone="neutral"
            startIcon={<ArrowBackRoundedIcon fontSize="small" />}
            onClick={handleBack}
            disabled={step === 1 || isSubmitting}
          >
            {t("form.actions.back")}
          </Button>

          {step < 4 ? (
            <Button
              variant="solid"
              tone="primary"
              endIcon={<ArrowForwardRoundedIcon fontSize="small" />}
              onClick={handleNext}
              disabled={isSubmitting}
            >
              {t("form.actions.next")}
            </Button>
          ) : (
            <Button
              variant="solid"
              tone="primary"
              startIcon={isSubmitting ? <CircularProgress size={18} color="inherit" /> : <PetsRoundedIcon />}
              onClick={handleSubmit}
              disabled={isSubmitting || isAuthLoading || !isAuthenticated}
            >
              {isSubmitting ? t("form.actions.sending") : t("form.actions.submit")}
            </Button>
          )}
        </Box>
      </Box>

      <Box className="flex items-center justify-center gap-2 text-xs text-neutral-400">
        <PetsRoundedIcon className="text-brand-500" fontSize="small" />
        <Typography variant="caption" color="text.secondary">
          {t("form.helper")}
        </Typography>
      </Box>
    </Box>
  );
}
