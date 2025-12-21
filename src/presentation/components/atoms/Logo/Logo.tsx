import { Box, Divider, Stack, Typography, useTheme } from "@mui/material";
import Image from "next/image";

import LogoImage from "@/presentation/assets/images/LOGO2.png";

export interface LogoProps {
  size?: number;
  showWordmark?: boolean;
  direction?: "row" | "column";
  subtitle?: string;
}

export function Logo({ size = 40, showWordmark = false, direction = "row", subtitle = "" }: LogoProps) {
  const theme = useTheme();

  return (
    <Stack direction={direction} alignItems="center" spacing={1.5}>
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
        <Typography variant="h6" sx={{ fontWeight: 900, color: "text.primary", lineHeight: 1 }}>
          Amigo Gigante
        </Typography>
      )}
      {subtitle && (
        <>
          {/* vertical divider */}
          {direction === "row" ? (
            <Divider
              orientation="vertical"
              flexItem
              sx={{
                height: "auto",
                alignSelf: "stretch",
                borderColor: "divider",
              }}
            />
          ) : (
            <Divider
              sx={{
                width: "100%",
                borderColor: "divider",
              }}
            />
          )}
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            {subtitle}
          </Typography>
        </>
      )}
   
    </Stack>
  );
}
