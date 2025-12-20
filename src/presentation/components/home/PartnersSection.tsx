import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import PetsRoundedIcon from "@mui/icons-material/PetsRounded";
import VolunteerActivismRoundedIcon from "@mui/icons-material/VolunteerActivismRounded";
import HealthAndSafetyRoundedIcon from "@mui/icons-material/HealthAndSafetyRounded";
import { Box, Container, Stack, Typography } from "@mui/material";

const partners = [
  { name: "Huellitas", icon: <PetsRoundedIcon fontSize="large" /> },
  { name: "Vida Animal", icon: <HealthAndSafetyRoundedIcon fontSize="large" /> },
  { name: "Corazones Peludos", icon: <VolunteerActivismRoundedIcon fontSize="large" /> },
  { name: "Casa Canina", icon: <HomeRoundedIcon fontSize="large" /> },
];

export function PartnersSection() {
  return (
    <Box component="section" sx={{ py: { xs: 8, md: 10 }, backgroundColor: "#fff" }}>
      <Container maxWidth="lg">
        <Box textAlign="center" sx={{ mb: 6 }}>
          <Typography variant="subtitle2" sx={{ color: "primary.main", fontWeight: 800, letterSpacing: 1.2 }}>
            Nuestros Aliados
          </Typography>
          <Typography variant="h4" sx={{ fontWeight: 800, mt: 1, color: "#0f172a" }}>
            Fundaciones que confían en nosotros
          </Typography>
        </Box>
        <Stack
          direction="row"
          justifyContent="center"
          alignItems="center"
          spacing={{ xs: 3, md: 6 }}
          flexWrap="wrap"
          sx={{ gap: 4 }}
        >
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
                  backgroundColor: "#eef2ff",
                  color: "#94a3b8",
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
      </Container>
    </Box>
  );
}
