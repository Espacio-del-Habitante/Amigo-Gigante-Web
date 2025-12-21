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
      <Stack direction="column" alignItems="center" spacing={2}>
        <Logo size={48} showWordmark subtitle="Foundations registry"/>
     

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
