"use client";

import { Box, Typography } from "@mui/material";
import { useTranslations } from "next-intl";

import type { AdoptionRequestAdopterProfile } from "@/domain/models/AdoptionRequest";

export interface AdoptionRequestProfileProps {
  profile: AdoptionRequestAdopterProfile;
}

const formatText = (value: string | null, fallback: string) => (value && value.trim().length > 0 ? value : fallback);

export function AdoptionRequestProfile({ profile }: AdoptionRequestProfileProps) {
  const t = useTranslations("adoptionsAdmin");
  const fallback = t("labels.notAvailable");

  const renderBoolean = (value: boolean | null) => {
    if (value === null || value === undefined) return fallback;
    return value ? t("labels.yes") : t("labels.no");
  };

  const renderHousing = () =>
    profile.housingType ? t(`detail.housingType.${profile.housingType}`) : fallback;

  const renderOwnership = () => {
    if (profile.isRent === null || profile.isRent === undefined) return fallback;
    return profile.isRent ? t("detail.ownership.rent") : t("detail.ownership.own");
  };

  return (
    <Box className="space-y-6">
      <Box className="rounded-2xl border border-neutral-100 bg-white">
        <Box className="flex items-center gap-2 border-b border-neutral-100 bg-neutral-50 px-6 py-4">
          <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
            {t("detail.profile.title")}
          </Typography>
        </Box>
        <Box className="grid grid-cols-1 gap-x-8 gap-y-6 p-6 md:grid-cols-2">
          <Box className="space-y-1">
            <Typography variant="caption" color="text.secondary">
              {t("detail.profile.fields.fullName")}
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 700 }}>
              {formatText(profile.displayName, fallback)}
            </Typography>
          </Box>
          <Box className="space-y-1">
            <Typography variant="caption" color="text.secondary">
              {t("detail.profile.fields.email")}
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 700 }}>
              {formatText(profile.email, fallback)}
            </Typography>
          </Box>
          <Box className="space-y-1">
            <Typography variant="caption" color="text.secondary">
              {t("detail.profile.fields.phone")}
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 700 }}>
              {formatText(profile.phone, fallback)}
            </Typography>
          </Box>
          <Box className="space-y-1">
            <Typography variant="caption" color="text.secondary">
              {t("detail.profile.fields.city")}
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 700 }}>
              {formatText(profile.city, fallback)}
            </Typography>
          </Box>
          <Box className="space-y-1">
            <Typography variant="caption" color="text.secondary">
              {t("detail.profile.fields.neighborhood")}
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 700 }}>
              {formatText(profile.neighborhood, fallback)}
            </Typography>
          </Box>
          <Box className="space-y-1">
            <Typography variant="caption" color="text.secondary">
              {t("detail.profile.fields.housingType")}
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 700 }}>
              {renderHousing()}
            </Typography>
          </Box>
          <Box className="space-y-1">
            <Typography variant="caption" color="text.secondary">
              {t("detail.profile.fields.ownership")}
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 700 }}>
              {renderOwnership()}
            </Typography>
          </Box>
          <Box className="space-y-1">
            <Typography variant="caption" color="text.secondary">
              {t("detail.profile.fields.allowsPets")}
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 700 }}>
              {renderBoolean(profile.allowsPets)}
            </Typography>
          </Box>
          <Box className="space-y-1">
            <Typography variant="caption" color="text.secondary">
              {t("detail.profile.fields.householdPeople")}
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 700 }}>
              {profile.householdPeopleCount ?? fallback}
            </Typography>
          </Box>
          <Box className="space-y-1">
            <Typography variant="caption" color="text.secondary">
              {t("detail.profile.fields.hasChildren")}
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 700 }}>
              {renderBoolean(profile.hasChildren)}
            </Typography>
          </Box>
          <Box className="space-y-1">
            <Typography variant="caption" color="text.secondary">
              {t("detail.profile.fields.childrenAges")}
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 700 }}>
              {formatText(profile.childrenAges, fallback)}
            </Typography>
          </Box>
          <Box className="space-y-1">
            <Typography variant="caption" color="text.secondary">
              {t("detail.profile.fields.hasOtherPets")}
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 700 }}>
              {renderBoolean(profile.hasOtherPets)}
            </Typography>
          </Box>
          <Box className="space-y-1">
            <Typography variant="caption" color="text.secondary">
              {t("detail.profile.fields.otherPets")}
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 700 }}>
              {formatText(profile.otherPetsDescription, fallback)}
            </Typography>
          </Box>
        </Box>
      </Box>

      <Box className="rounded-2xl border border-neutral-100 bg-white">
        <Box className="flex items-center gap-2 border-b border-neutral-100 bg-neutral-50 px-6 py-4">
          <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
            {t("detail.experience.title")}
          </Typography>
        </Box>
        <Box className="space-y-6 p-6">
          <Box className="grid grid-cols-1 gap-x-8 gap-y-6 md:grid-cols-2">
            <Box className="space-y-1">
              <Typography variant="caption" color="text.secondary">
                {t("detail.experience.fields.hoursAlone")}
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 700 }}>
                {profile.hoursAlonePerDay ?? fallback}
              </Typography>
            </Box>
            <Box className="space-y-1">
              <Typography variant="caption" color="text.secondary">
                {t("detail.experience.fields.travelPlan")}
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 700 }}>
                {formatText(profile.travelPlan, fallback)}
              </Typography>
            </Box>
            <Box className="space-y-1">
              <Typography variant="caption" color="text.secondary">
                {t("detail.experience.fields.vetCosts")}
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 700 }}>
                {renderBoolean(profile.acceptsVetCosts)}
              </Typography>
            </Box>
            <Box className="space-y-1">
              <Typography variant="caption" color="text.secondary">
                {t("detail.experience.fields.lifetimeCommitment")}
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 700 }}>
                {renderBoolean(profile.acceptsLifetimeCommitment)}
              </Typography>
            </Box>
          </Box>
          <Box className="space-y-2">
            <Typography variant="caption" color="text.secondary">
              {t("detail.experience.fields.experience")}
            </Typography>
            <Box className="rounded-lg bg-neutral-50 px-4 py-3">
              <Typography variant="body2" color="text.secondary">
                {formatText(profile.experienceText, fallback)}
              </Typography>
            </Box>
          </Box>
          <Box className="space-y-2">
            <Typography variant="caption" color="text.secondary">
              {t("detail.experience.fields.motivation")}
            </Typography>
            <Box className="rounded-lg bg-neutral-50 px-4 py-3">
              <Typography variant="body2" color="text.secondary">
                {formatText(profile.motivationText, fallback)}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
