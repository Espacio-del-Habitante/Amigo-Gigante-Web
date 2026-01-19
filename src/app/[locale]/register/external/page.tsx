"use client";

import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import { Box, Container, Stack } from "@mui/material";

import { RegisterFooter } from "@/presentation/components/register/RegisterFooter";
import { RegisterExternalForm } from "@/presentation/components/register/RegisterExternalForm";
import { RegisterExternalHeader } from "@/presentation/components/register/RegisterExternalHeader";
import { RegisterExternalImageSection } from "@/presentation/components/register/RegisterExternalImageSection";

export default function RegisterExternalPage() {
  return (
    <Box className="min-h-screen bg-neutral-50" sx={{ display: "flex", flexDirection: "column" }}>
      <Container maxWidth="xl" sx={{ flex: 1, py: { xs: 4, md: 6 }, maxWidth: 1440, px: { xs: 3, sm: 4 } }}>
        <Stack spacing={{ xs: 4, md: 6 }}>
          <RegisterExternalHeader />
          <Box className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]" sx={{ alignItems: "stretch" }}>
            <RegisterExternalForm ctaIcon={<ArrowForwardRoundedIcon />} />
            <RegisterExternalImageSection />
          </Box>
        </Stack>
      </Container>
      <RegisterFooter />
    </Box>
  );
}
