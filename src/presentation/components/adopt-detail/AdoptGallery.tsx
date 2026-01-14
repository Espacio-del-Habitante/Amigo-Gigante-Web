"use client";

import FavoriteBorderRoundedIcon from "@mui/icons-material/FavoriteBorderRounded";
import { alpha, Box, Stack, useTheme } from "@mui/material";
import { useTranslations } from "next-intl";

import { Chip, IconButton } from "@/presentation/components/atoms";

interface AdoptGalleryProps {
  name: string;
  mainImageUrl: string;
  thumbnails: string[];
  statusLabel: string;
  statusTone?: "brand" | "accent" | "neutral";
}

export function AdoptGallery({
  name,
  mainImageUrl,
  thumbnails,
  statusLabel,
  statusTone = "brand",
}: AdoptGalleryProps) {
  const theme = useTheme();
  const t = useTranslations("adoptDetail");
  const common = useTranslations("common");

  const visibleThumbnails = thumbnails.slice(0, 4);

  return (
    <Stack spacing={2.5}>
      <Box
        sx={{
          position: "relative",
          overflow: "hidden",
          borderRadius: 3,
          boxShadow: theme.shadows[3],
        }}
      >
        <Box
          component="img"
          src={mainImageUrl}
          alt={t("gallery.mainImageAlt", { name })}
          sx={{
            width: "100%",
            height: "100%",
            aspectRatio: "4 / 3",
            objectFit: "cover",
            transition: "transform 0.5s ease",
            backgroundColor: alpha(theme.palette.background.paper, 0.6),
            ":hover": { transform: "scale(1.03)" },
          }}
        />

        <Box sx={{ position: "absolute", top: 16, left: 16 }}>
          <Chip
            label={statusLabel}
            tone={statusTone}
            variant="solid"
            sx={{
              fontWeight: 800,
              boxShadow: theme.shadows[1],
            }}
          />
        </Box>

        <IconButton
          aria-label={common("labels.favorite")}
          tone="neutral"
          variant="ghost"
          sx={{
            position: "absolute",
            bottom: 16,
            right: 16,
            backgroundColor: alpha(theme.palette.common.white, 0.92),
            boxShadow: theme.shadows[2],
          }}
        >
          <FavoriteBorderRoundedIcon fontSize="small" />
        </IconButton>
      </Box>

      {visibleThumbnails.length > 0 ? (
        <Box className="grid grid-cols-4 gap-3">
          {visibleThumbnails.map((url, index) => (
            <Box
              key={`${url}-${index}`}
              sx={{
                borderRadius: 2,
                overflow: "hidden",
                border: "1px solid",
                borderColor: "divider",
                backgroundColor: alpha(theme.palette.background.paper, 0.7),
              }}
            >
              <Box
                component="img"
                src={url}
                alt={t("gallery.thumbnailAlt", { index: index + 1 })}
                sx={{
                  width: "100%",
                  height: "100%",
                  aspectRatio: "1 / 1",
                  objectFit: "cover",
                }}
              />
            </Box>
          ))}
        </Box>
      ) : null}
    </Stack>
  );
}
