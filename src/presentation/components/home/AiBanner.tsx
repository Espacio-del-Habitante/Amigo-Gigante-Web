import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import { Box, Button, Container, Stack, Typography } from "@mui/material";

export function AiBanner() {
  return (
    <Box component="section" sx={{ py: { xs: 6, md: 8 }, backgroundColor: "#fff" }}>
      <Container maxWidth="lg">
        <Box
          sx={{
            p: { xs: 4, md: 6 },
            borderRadius: 4,
            background: "linear-gradient(90deg, #7c3aed, #1cb0f6)",
            color: "#fff",
            position: "relative",
            overflow: "hidden",
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
            spacing={3}
            alignItems="center"
            justifyContent="space-between"
            sx={{ position: "relative" }}
          >
            <Stack spacing={1}>
              <Stack
                direction="row"
                spacing={1}
                alignItems="center"
                sx={{
                  backgroundColor: "rgba(255,255,255,0.18)",
                  px: 2,
                  py: 0.8,
                  borderRadius: 999,
                  width: "fit-content",
                  fontWeight: 800,
                  letterSpacing: 0.5,
                  textTransform: "uppercase",
                  fontSize: 12,
                }}
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
