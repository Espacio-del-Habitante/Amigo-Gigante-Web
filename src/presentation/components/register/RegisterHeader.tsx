"use client";

import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import { Box, Stack, Typography } from "@mui/material";
import Link from "next/link";

import { Button, Logo } from "@/presentation/components/atoms";

export function RegisterHeader() {
  return (
    <Stack
      direction={{ xs: "column", sm: "row" }}
      alignItems={{ xs: "flex-start", sm: "center" }}
      justifyContent="space-between"
      spacing={2.5}
    >
      <Stack direction="row" alignItems="center" spacing={2}>
        <Logo size={48} showWordmark />
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 800, lineHeight: 1.2 }}>
            Amigo Gigante
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Foundations registry
          </Typography>
        </Box>
      </Stack>
      <Button
        component={Link}
        href="/"
        aria-label="Back to Home"
        variant="outlined"
        rounded="pill"
        startIcon={<ArrowBackRoundedIcon />}
        sx={{
          fontWeight: 700,
          "&:hover": {
            transform: "translateY(-1px)",
            transition: "transform 150ms ease, box-shadow 150ms ease",
          },
        }}
      >
        Back to Home
      </Button>
    </Stack>
  );
}
