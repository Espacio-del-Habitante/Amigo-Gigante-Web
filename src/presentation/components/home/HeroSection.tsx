import FilterAltRoundedIcon from "@mui/icons-material/FilterAltRounded";
import PetsRoundedIcon from "@mui/icons-material/PetsRounded";
import PlaceRoundedIcon from "@mui/icons-material/PlaceRounded";
import VolunteerActivismRoundedIcon from "@mui/icons-material/VolunteerActivismRounded";
import { Box, Card, Container, Stack, Typography } from "@mui/material";

import type { Animal } from "@/domain/models/Animal";
import { Button, Chip } from "@/presentation/components/atoms";

interface HeroSectionProps {
  heroAnimals: Animal[];
}

export function HeroSection({ heroAnimals }: HeroSectionProps) {
  const [first, second] = heroAnimals;

  return (
    <Box component="section" className="relative overflow-hidden bg-gradient-to-br from-neutral-50 to-white pb-12 pt-16 md:pb-16 md:pt-20">
      <Container maxWidth="lg" className="grid items-center gap-8 md:grid-cols-2">
        <Stack className="gap-6">
          <Chip
            icon={<PetsRoundedIcon />}
            label="Más de 500 amigos buscando hogar"
            tone="brand"
            variant="soft"
            sx={{ alignSelf: "flex-start" }}
          />
          <Box>
            <Typography
              variant="h2"
              sx={{
                fontSize: { xs: "2.5rem", md: "3rem", lg: "3.4rem" },
                fontWeight: 900,
                lineHeight: 1.1,
                color: "text.primary",
              }}
            >
              Encuentra a tu
              <br />
              <Box component="span" sx={{ color: "primary.main", position: "relative" }}>
                Compañero Ideal
              </Box>
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mt: 2, maxWidth: 560, lineHeight: 1.7 }}>
              Adoptar salva vidas. Apadrinar da esperanza. Conecta con fundaciones verificadas y cambia el mundo de una
              mascota hoy.
            </Typography>
          </Box>
          <Stack direction={{ xs: "column", sm: "row" }} className="flex flex-col gap-3 rounded-2xl border border-solid bg-white p-4 sm:flex-row" sx={{ maxWidth: 620, borderColor: "divider", boxShadow: 3 }}>
            <Button
              fullWidth
              variant="outlined"
              rounded="default"
              startIcon={<FilterAltRoundedIcon />}
            >
              Perros
            </Button>
            <Button
              fullWidth
              variant="outlined"
              rounded="default"
              startIcon={<PlaceRoundedIcon />}
            >
              Cualquier ubicación
            </Button>
            <Button
              fullWidth
              rounded="default"
              sx={{ boxShadow: 2, fontWeight: 800 }}
            >
              Buscar
            </Button>
          </Stack>
        </Stack>
        <Box className="grid items-start gap-4 sm:grid-cols-2 md:gap-6">
          <Stack className="gap-3 sm:mt-4">
            {first && (
              <Card
                sx={{
                  borderRadius: 2,
                  overflow: "hidden",
                  boxShadow: 2,
                  border: "1px solid",
                  borderColor: "divider",
                }}
              >
                <Box component="img" src={first.imageUrl} alt={first.name} sx={{ height: 240, width: "100%", objectFit: "cover" }} />
              </Card>
            )}
            <Card className="flex items-center gap-3 rounded-2xl border border-solid p-3" sx={{ borderColor: "divider", boxShadow: 2 }}>
              <Chip
                icon={<PetsRoundedIcon color="secondary" />}
                label="Fundaciones 100% verificadas"
                tone="accent"
                variant="soft"
              />
            </Card>
          </Stack>
          <Stack className="gap-3">
            <Card
              sx={{
                backgroundColor: "secondary.main",
                color: "common.white",
                borderRadius: 2,
                p: 3,
                minHeight: 140,
                boxShadow: 3,
              }}
            >
              <VolunteerActivismRoundedIcon sx={{ fontSize: 36, mb: 1 }} />
              <Typography variant="h6" sx={{ fontWeight: 800, lineHeight: 1.3 }}>
                Apadrina con amor
              </Typography>
            </Card>
            {second && (
              <Card
                sx={{
                  borderRadius: 2,
                  overflow: "hidden",
                  boxShadow: 2,
                  border: "1px solid",
                  borderColor: "divider",
                }}
              >
                <Box component="img" src={second.imageUrl} alt={second.name} sx={{ height: 240, width: "100%", objectFit: "cover" }} />
              </Card>
            )}
          </Stack>
        </Box>
      </Container>
    </Box>
  );
}
