"use client";

import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import LockRoundedIcon from "@mui/icons-material/LockRounded";
import { Box, Container, Stack } from "@mui/material";

import { RegisterFooter } from "@/presentation/components/register/RegisterFooter";
import { RegisterForm } from "@/presentation/components/register/RegisterForm";
import { RegisterHeader } from "@/presentation/components/register/RegisterHeader";
import { RegisterImageSection } from "@/presentation/components/register/RegisterImageSection";

export default function RegisterPage() {
  return (
    <Box className="min-h-screen bg-neutral-50" sx={{ display: "flex", flexDirection: "column" }}>
      <Container maxWidth="xl" sx={{ flex: 1, py: { xs: 4, md: 6 }, maxWidth: 1440, px: { xs: 3, sm: 4 } }}>
        <Stack spacing={{ xs: 4, md: 6 }}>
          <RegisterHeader />
          <Box className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]" sx={{ alignItems: "stretch" }}>
            <RegisterForm
              ctaIcon={<ArrowForwardRoundedIcon />}
              badgeIcon={<LockRoundedIcon fontSize="small" />}
            />
            <RegisterImageSection />
          </Box>
        </Stack>
      </Container>
      <RegisterFooter />
    </Box>
  );
}
