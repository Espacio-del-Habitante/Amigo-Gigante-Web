"use client";

import { Box, Container } from "@mui/material";

import { Copyright } from "@/presentation/components/atoms/Copyright";

export function RegisterFooter() {
  return (
    <Box component="footer" className="border-t border-solid border-neutral-200 bg-white">
      <Container maxWidth="xl" sx={{ maxWidth: 1440, px: { xs: 3, sm: 4 } }}>
        <Copyright
          textAlign={{ xs: "center", lg: "left" }}
          sx={{
            py: 3,
          }}
        />
      </Container>
    </Box>
  );
}
