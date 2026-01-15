"use client";

import { Box, Stack, Typography, useTheme } from "@mui/material";
import { useTranslations } from "next-intl";

interface ShopGalleryProps {
  imageUrl: string | null;
  name: string;
}

export function ShopGallery({ imageUrl, name }: ShopGalleryProps) {
  const theme = useTheme();
  const t = useTranslations("shopDetail");

  return (
    <Box
      sx={{
        borderRadius: 4,
        overflow: "hidden",
        border: "1px solid",
        borderColor: "divider",
        backgroundColor: "background.paper",
        boxShadow: theme.shadows[1],
        minHeight: 320,
      }}
    >
      {imageUrl ? (
        <Box
          component="img"
          src={imageUrl}
          alt={name}
          sx={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
          }}
        />
      ) : (
        <Stack alignItems="center" justifyContent="center" sx={{ minHeight: 320 }}>
          <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 700 }}>
            {t("labels.noImage")}
          </Typography>
        </Stack>
      )}
    </Box>
  );
}
