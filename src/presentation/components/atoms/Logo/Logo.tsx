import { Box, Stack, Typography, useTheme } from "@mui/material";
import Image from "next/image";

import LogoImage from "@/presentation/assets/images/LOGO2.png";

export interface LogoProps {
  size?: number;
  showWordmark?: boolean;
}

export function Logo({ size = 40, showWordmark = false }: LogoProps) {
  const theme = useTheme();

  return (
    <Stack direction="row" alignItems="center" spacing={1.5}>
      <Box
        component="span"
        sx={{
          width: size,
          height: size,
          borderRadius: "50%",
          backgroundColor: theme.palette.primary.main,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          overflow: "hidden",
          boxShadow: theme.shadows[2],
          flexShrink: 0,
        }}
      >
        <Image
          src={LogoImage}
          alt="Amigo Gigante"
          fill
          sizes={`${size}px`}
          style={{ objectFit: "contain" }}
          priority
        />
      </Box>
      {showWordmark && (
        <Typography variant="h6" sx={{ fontWeight: 900, color: theme.palette.text.primary }}>
          Amigo Gigante
        </Typography>
      )}
    </Stack>
  );
}
