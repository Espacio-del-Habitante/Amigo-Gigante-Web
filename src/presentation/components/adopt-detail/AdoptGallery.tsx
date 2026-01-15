"use client";

import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import FavoriteBorderRoundedIcon from "@mui/icons-material/FavoriteBorderRounded";
import { alpha, Box, Chip as MuiChip, useTheme } from "@mui/material";
import { useTranslations } from "next-intl";

import type { AnimalManagementStatus } from "@/domain/models/AnimalManagement";
import { IconButton } from "@/presentation/components/atoms";

interface AdoptGalleryProps {
  mainImage: string;
  mainAlt: string;
  thumbnails: string[];
  selectedImage: string;
  status: AnimalManagementStatus;
  statusLabel: string;
  onSelect: (url: string) => void;
}

const statusToneMap: Record<AnimalManagementStatus, "success" | "info" | "warning" | "secondary" | "error"> = {
  available: "success",
  adopted: "info",
  pending: "warning",
  in_treatment: "secondary",
  inactive: "error",
};

export function AdoptGallery({
  mainImage,
  mainAlt,
  thumbnails,
  selectedImage,
  status,
  statusLabel,
  onSelect,
}: AdoptGalleryProps) {
  const theme = useTheme();
  const t = useTranslations("adoptDetail");
  const isPlaceholder = mainImage === "/file.svg";
  const statusTone = statusToneMap[status];
  const statusColor = theme.palette[statusTone].main;

  return (
    <Box className="space-y-4">
      <Box
        sx={{
          position: "relative",
          borderRadius: 3,
          overflow: "hidden",
          boxShadow: theme.shadows[3],
          aspectRatio: "4 / 3",
        }}
      >
        <Box
          component="img"
          src={mainImage}
          alt={mainAlt}
          sx={{
            width: "100%",
            height: "100%",
            objectFit: isPlaceholder ? "contain" : "cover",
            backgroundColor: alpha(theme.palette.background.paper, 0.9),
            transition: "transform 0.4s ease",
            ":hover": { transform: "scale(1.03)" },
          }}
        />

        <MuiChip
          icon={<CheckCircleRoundedIcon sx={{ color: "inherit" }} />}
          label={statusLabel}
          size="small"
          sx={{
            position: "absolute",
            top: 16,
            left: 16,
            fontWeight: 800,
            backgroundColor: alpha(statusColor, 0.16),
            color: statusColor,
            boxShadow: theme.shadows[2],
          }}
        />

        <IconButton
          variant="ghost"
          aria-label={t("gallery.favorite")}
          sx={{
            position: "absolute",
            bottom: 16,
            right: 16,
            backgroundColor: alpha(theme.palette.common.white, 0.88),
            color: theme.palette.text.primary,
          }}
        >
          <FavoriteBorderRoundedIcon fontSize="small" />
        </IconButton>
      </Box>

      {thumbnails.length > 0 ? (
        <Box sx={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 2 }}>
          {thumbnails.map((url, index) => {
            const isActive = url === selectedImage;
            return (
              <Box
                key={`${url}-${index}`}
                component="button"
                type="button"
                onClick={() => onSelect(url)}
                aria-label={t("gallery.thumbnail", { index: index + 1 })}
                sx={{
                  position: "relative",
                  borderRadius: 2,
                  overflow: "hidden",
                  aspectRatio: "1 / 1",
                  border: "2px solid",
                  borderColor: isActive ? theme.palette.primary.main : "transparent",
                  boxShadow: isActive ? theme.shadows[2] : "none",
                  backgroundColor: alpha(theme.palette.background.paper, 0.9),
                  transition: "opacity 0.2s ease, border-color 0.2s ease",
                  ":hover": {
                    opacity: 0.85,
                  },
                }}
              >
                <Box
                  component="img"
                  src={url}
                  alt=""
                  aria-hidden="true"
                  sx={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </Box>
            );
          })}
        </Box>
      ) : null}
    </Box>
  );
}
