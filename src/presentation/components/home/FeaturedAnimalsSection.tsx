import ArrowRightAltRoundedIcon from "@mui/icons-material/ArrowRightAltRounded";
import { Box, Container, Stack, Typography, Link } from "@mui/material";

import type { Animal } from "@/domain/models/Animal";
import { AnimalCard } from "./AnimalCard";

interface FeaturedAnimalsSectionProps {
  animals: Animal[];
}

export function FeaturedAnimalsSection({ animals }: FeaturedAnimalsSectionProps) {
  return (
    <Box component="section" sx={{ py: { xs: 6, md: 8 }, backgroundColor: "#f7fbff" }}>
      <Container maxWidth="lg">
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", sm: "flex-end" }}
          spacing={2}
          sx={{ mb: 4 }}
        >
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
        <Box
          sx={{
            display: "grid",
            gap: 3,
            gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", md: "repeat(4, 1fr)" },
          }}
        >
          {animals.map((animal) => (
            <AnimalCard key={animal.id} animal={animal} />
          ))}
        </Box>
      </Container>
    </Box>
  );
}
