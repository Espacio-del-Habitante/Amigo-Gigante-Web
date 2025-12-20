"use client";

import { Button, Container, Stack, Typography } from "@mui/material";

export default function DebugPage() {
  return (
    <Container maxWidth="sm" sx={{ py: 6 }}>
      <Stack spacing={3}>
        <Stack spacing={1}>
          <Typography variant="h4" component="h1">
            Debug
          </Typography>
          <Typography color="text.secondary">
            Usa esta vista para validar estilos y componentes básicos de MUI.
          </Typography>
        </Stack>

        <Button variant="contained" size="large">
          Run debug
        </Button>
      </Stack>
    </Container>
  );
}
