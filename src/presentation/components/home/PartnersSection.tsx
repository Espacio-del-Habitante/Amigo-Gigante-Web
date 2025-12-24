import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import PetsRoundedIcon from "@mui/icons-material/PetsRounded";
import VolunteerActivismRoundedIcon from "@mui/icons-material/VolunteerActivismRounded";
import HealthAndSafetyRoundedIcon from "@mui/icons-material/HealthAndSafetyRounded";
import { Box, Stack, Typography } from "@mui/material";
import { useTranslations } from "next-intl";

import { Section } from "@/presentation/components/layouts";

const partners = [
  { name: "Huellitas", icon: <PetsRoundedIcon fontSize="large" /> },
  { name: "Vida Animal", icon: <HealthAndSafetyRoundedIcon fontSize="large" /> },
  { name: "Corazones Peludos", icon: <VolunteerActivismRoundedIcon fontSize="large" /> },
  { name: "Casa Canina", icon: <HomeRoundedIcon fontSize="large" /> },
];

export function PartnersSection() {
  const t = useTranslations("home");

  return (
    <Section background="paper" spacingY={{ xs: 14, md: 18 }}>
      <Box textAlign="center" className="mb-10">
        <Typography variant="subtitle2" sx={{ color: "primary.main", fontWeight: 800, letterSpacing: 1.2 }}>
          {t("partners.subtitle")}
        </Typography>
        <Typography variant="h4" sx={{ fontWeight: 800, mt: 1, color: "text.primary" }}>
          {t("partners.title")}
        </Typography>
      </Box>
      <Stack direction="row" flexWrap="wrap" className="mt-4 flex items-center justify-center gap-8 md:gap-12">
        {partners.map((partner) => (
          <Stack
            key={partner.name}
            spacing={1.5}
            alignItems="center"
            sx={{
              color: "text.secondary",
              transition: "all 0.2s ease",
              ":hover": { color: "primary.main" },
            }}
          >
            <Box
              sx={{
                width: 80,
                height: 80,
                borderRadius: "50%",
                backgroundColor: "primary.light",
                color: "text.secondary",
                display: "grid",
                placeItems: "center",
              }}
            >
              {partner.icon}
            </Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
              {partner.name}
            </Typography>
          </Stack>
        ))}
      </Stack>
    </Section>
  );
}
