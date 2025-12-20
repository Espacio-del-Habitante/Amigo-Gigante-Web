import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import { Box, Button, Container, Stack, Typography } from "@mui/material";

export function AiBanner() {
  return (
    <Box component="section" className="bg-white py-12 md:py-16">
      <Container maxWidth="lg">
        <Box
          className="relative overflow-hidden rounded-[32px] px-6 py-8 md:px-10 md:py-12"
          sx={{
            background: "linear-gradient(90deg, #7c3aed, #1cb0f6)",
            color: "#fff",
            boxShadow: "0 20px 45px rgba(37, 99, 235, 0.22)",
          }}
        >
          <Box
            sx={{
              position: "absolute",
              right: -60,
              top: -80,
              width: 240,
              height: 240,
              backgroundColor: "rgba(255,255,255,0.12)",
              filter: "blur(60px)",
              borderRadius: "50%",
            }}
          />
          <Stack
            direction={{ xs: "column", md: "row" }}
            alignItems="center"
            justifyContent="space-between"
            className="relative flex-col gap-4 md:flex-row md:gap-6"
          >
            <Stack className="gap-3">
              <Stack
                direction="row"
                alignItems="center"
                className="w-fit items-center gap-2 rounded-full px-3 py-2 text-xs font-extrabold uppercase tracking-[0.05em]"
                sx={{ backgroundColor: "rgba(255,255,255,0.18)" }}
              >
                <AutoAwesomeRoundedIcon sx={{ fontSize: 18 }} />
                <span>Nuevo: IA Match</span>
              </Stack>
              <Typography variant="h4" sx={{ fontWeight: 800 }}>
                ¿No sabes por dónde empezar?
              </Typography>
              <Typography variant="body1" sx={{ color: "rgba(255,255,255,0.85)", maxWidth: 720, lineHeight: 1.7 }}>
                Nuestra Inteligencia Artificial analiza tu estilo de vida y preferencias para recomendarte el compañero
                perfecto.
              </Typography>
            </Stack>
            <Button
              variant="contained"
              endIcon={<ArrowForwardRoundedIcon />}
              sx={{
                backgroundColor: "#fff",
                color: "#6d28d9",
                fontWeight: 800,
                px: 4,
                py: 1.4,
                borderRadius: 2.5,
                boxShadow: "0 15px 30px rgba(0,0,0,0.12)",
                ":hover": { backgroundColor: "#f5f3ff" },
              }}
            >
              Probar recomendador IA
            </Button>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
}
