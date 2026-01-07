"use client";

import { Box, Button, Container, Stack, Typography } from "@mui/material";
import Link from "next/link";
import { useLocale } from "next-intl";

export default function ForbiddenPage() {
  const locale = useLocale();

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "grey.50", display: "flex", alignItems: "center" }}>
      <Container maxWidth="sm">
        <Stack spacing={2.5} sx={{ textAlign: "center", p: { xs: 3, sm: 4 } }}>
          <Typography variant="h3" sx={{ fontWeight: 900 }}>
            403
          </Typography>
          <Typography variant="h5" sx={{ fontWeight: 800 }}>
            Acceso denegado
          </Typography>
          <Typography color="text.secondary" sx={{ lineHeight: 1.7 }}>
            No tienes permisos para acceder a esta sección.
          </Typography>

          <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} justifyContent="center">
            <Button component={Link} href={`/${locale}`} variant="contained">
              Ir al inicio
            </Button>
            <Button component={Link} href={`/${locale}/login`} variant="outlined">
              Iniciar sesión
            </Button>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}


