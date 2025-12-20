import FilterAltRoundedIcon from "@mui/icons-material/FilterAltRounded";
import PetsRoundedIcon from "@mui/icons-material/PetsRounded";
import PlaceRoundedIcon from "@mui/icons-material/PlaceRounded";
import VolunteerActivismRoundedIcon from "@mui/icons-material/VolunteerActivismRounded";
import { Box, Button, Card, Chip, Container, Stack, Typography } from "@mui/material";

import type { Animal } from "@/domain/models/Animal";

interface HeroSectionProps {
  heroAnimals: Animal[];
}

export function HeroSection({ heroAnimals }: HeroSectionProps) {
  const [first, second] = heroAnimals;

  return (
    <Box
      component="section"
      sx={{
        position: "relative",
        overflow: "hidden",
        pt: { xs: 8, md: 10 },
        pb: { xs: 8, md: 12 },
        background: "linear-gradient(135deg, #f0f7ff 0%, #ffffff 60%)",
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)" },
            gap: { xs: 4, md: 6 },
            alignItems: "center",
          }}
        >
          <Stack spacing={3}>
            <Chip
              icon={<PetsRoundedIcon />}
              label="Más de 500 amigos buscando hogar"
              sx={{
                alignSelf: "flex-start",
                backgroundColor: "#e0f2fe",
                color: "#0284c7",
                fontWeight: 700,
              }}
            />
            <Box>
              <Typography
                variant="h2"
                sx={{
                  fontSize: { xs: "2.5rem", md: "3rem", lg: "3.4rem" },
                  fontWeight: 900,
                  lineHeight: 1.1,
                  color: "#0f172a",
                }}
              >
                Encuentra a tu
                <br />
                <Box component="span" sx={{ color: "primary.main", position: "relative" }}>
                  Compañero Ideal
                </Box>
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mt: 2, maxWidth: 560, lineHeight: 1.7 }}>
                Adoptar salva vidas. Apadrinar da esperanza. Conecta con fundaciones verificadas y cambia el mundo de
                una mascota hoy.
              </Typography>
            </Box>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              sx={{
                backgroundColor: "#fff",
                borderRadius: 3,
                border: "1px solid",
                borderColor: "divider",
                boxShadow: "0 18px 50px rgba(59, 130, 246, 0.08)",
                p: 2,
                maxWidth: 620,
              }}
            >
              <Button
                fullWidth
                variant="outlined"
                startIcon={<FilterAltRoundedIcon />}
                sx={{ borderRadius: 2, textTransform: "none", fontWeight: 700 }}
              >
                Perros
              </Button>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<PlaceRoundedIcon />}
                sx={{ borderRadius: 2, textTransform: "none", fontWeight: 700 }}
              >
                Cualquier ubicación
              </Button>
              <Button
                fullWidth
                variant="contained"
                sx={{ borderRadius: 2, textTransform: "none", fontWeight: 800, boxShadow: "0 12px 30px rgba(28,176,246,0.35)" }}
              >
                Buscar
              </Button>
            </Stack>
          </Stack>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
              gap: 3,
              alignItems: "start",
            }}
          >
            <Stack spacing={3} sx={{ mt: { sm: 4 } }}>
              {first && (
                <Card
                  sx={{
                    borderRadius: 2,
                    overflow: "hidden",
                    boxShadow: "0 15px 40px rgba(0,0,0,0.08)",
                    border: "1px solid",
                    borderColor: "divider",
                  }}
                >
                  <Box component="img" src={first.imageUrl} alt={first.name} sx={{ height: 240, width: "100%", objectFit: "cover" }} />
                </Card>
              )}
              <Card
                sx={{
                  borderRadius: 2,
                  p: 2.5,
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
                  border: "1px solid",
                  borderColor: "divider",
                }}
              >
                <Chip
                  icon={<PetsRoundedIcon sx={{ color: "#16a34a" }} />}
                  label="Fundaciones 100% verificadas"
                  sx={{
                    backgroundColor: "#ecfdf3",
                    color: "#15803d",
                    fontWeight: 700,
                  }}
                />
              </Card>
            </Stack>
            <Stack spacing={3}>
              <Card
                sx={{
                  backgroundColor: "secondary.main",
                  color: "#fff",
                  borderRadius: 2,
                  p: 3,
                  minHeight: 140,
                  boxShadow: "0 18px 40px rgba(249,115,22,0.35)",
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
                    boxShadow: "0 15px 40px rgba(0,0,0,0.08)",
                    border: "1px solid",
                    borderColor: "divider",
                  }}
                >
                  <Box component="img" src={second.imageUrl} alt={second.name} sx={{ height: 240, width: "100%", objectFit: "cover" }} />
                </Card>
              )}
            </Stack>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
