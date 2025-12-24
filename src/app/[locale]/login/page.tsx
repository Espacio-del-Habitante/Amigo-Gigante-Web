"use client";

import { Box, Container, Stack } from "@mui/material";

import { LoginForm } from "@/presentation/components/login/LoginForm";
import { LoginHeader } from "@/presentation/components/login/LoginHeader";
import { LoginImageSection } from "@/presentation/components/login/LoginImageSection";

export default function LoginPage() {
  return (
    <Box className="min-h-screen bg-neutral-50" sx={{ display: "flex", flexDirection: "column" }}>
      <Container maxWidth="xl" sx={{ flex: 1, py: { xs: 4, md: 6 }, maxWidth: 1440, px: { xs: 3, sm: 4 } }}>
        <Stack spacing={{ xs: 4, md: 6 }}>
          <LoginHeader />
          <Box className="grid gap-8 lg:grid-cols-2" sx={{ alignItems: "stretch" }}>
            <LoginImageSection />
            <LoginForm />
          </Box>
        </Stack>
      </Container>
    </Box>
  );
}
