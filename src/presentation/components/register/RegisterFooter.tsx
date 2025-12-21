"use client";

import { Box, Container, Typography } from "@mui/material";

export function RegisterFooter() {
  return (
    <Box component="footer" className="border-t border-solid border-neutral-200 bg-white">
      <Container maxWidth="xl" sx={{ maxWidth: 1440, px: { xs: 3, sm: 4 } }}>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            py: 3,
            textAlign: { xs: "center", lg: "left" },
          }}
        >
          © 2024 Amigo Gigante. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
}
