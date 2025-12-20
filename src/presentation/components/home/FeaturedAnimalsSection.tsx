import ArrowRightAltRoundedIcon from "@mui/icons-material/ArrowRightAltRounded";
import { Box, Container, Stack, Typography, Link } from "@mui/material";

import type { Animal } from "@/domain/models/Animal";
import { AnimalCard } from "./AnimalCard";

interface FeaturedAnimalsSectionProps {
  animals: Animal[];
}

export function FeaturedAnimalsSection({ animals }: FeaturedAnimalsSectionProps) {
  return (
    <Box component="section" className="bg-[#f7fbff] py-12 md:py-16">
      <Container maxWidth="lg">
        <Stack direction={{ xs: "column", sm: "row" }} className="mb-8 items-start gap-3 sm:items-end sm:justify-between">
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 800, color: "#0f172a" }}>
              Amigos Destacados
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>
              Recién llegados buscando una segunda oportunidad
            </Typography>
          </Box>
          <Link
            href="#"
            underline="none"
            sx={{
              display: { xs: "none", sm: "inline-flex" },
              alignItems: "center",
              color: "primary.main",
              fontWeight: 800,
              gap: 0.5,
            }}
          >
            Ver todos
            <ArrowRightAltRoundedIcon />
          </Link>
        </Stack>
        <Box className="grid gap-6 sm:grid-cols-2 md:grid-cols-4">
          {animals.map((animal) => (
            <AnimalCard key={animal.id} animal={animal} />
          ))}
        </Box>
      </Container>
    </Box>
  );
}
