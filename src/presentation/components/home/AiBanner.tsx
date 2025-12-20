import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import { Box, Container, Stack, Typography } from "@mui/material";

import { Button } from "@/presentation/components/atoms";

export function AiBanner() {
  return (
    <Box component="section" className="bg-white py-12 md:py-16">
      <Container maxWidth="lg">
        <Box
          className="relative overflow-hidden rounded-[32px] px-6 py-8 md:px-10 md:py-12"
          sx={(theme) => ({
            background: `linear-gradient(90deg, ${theme.palette.secondary.main}, ${theme.palette.primary.main})`,
            color: theme.palette.common.white,
            boxShadow: theme.shadows[3],
          })}
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
              tone="secondary"
              rounded="default"
              endIcon={<ArrowForwardRoundedIcon />}
              sx={{ px: 4, py: 1.4, boxShadow: 3 }}
            >
              Probar recomendador IA
            </Button>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
}
