import FavoriteBorderRoundedIcon from "@mui/icons-material/FavoriteBorderRounded";
import LocationOnRoundedIcon from "@mui/icons-material/LocationOnRounded";
import { alpha, Box, Card, CardContent, Stack, Typography, useTheme } from "@mui/material";
import { useTranslations } from "next-intl";

import type { Animal } from "@/domain/models/Animal";
import { IconButton } from "@/presentation/components/atoms";
import { StatusChip } from "@/presentation/components/molecules";

interface AnimalCardProps {
  animal: Animal;
}

export function AnimalCard({ animal }: AnimalCardProps) {
  const theme = useTheme();
  const t = useTranslations("common");

  return (
    <Card
      sx={{
        borderRadius: 2,
        border: "1px solid",
        borderColor: "divider",
        boxShadow: theme.shadows[2],
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
        ":hover": {
          transform: "translateY(-4px)",
          boxShadow: theme.shadows[3],
        },
        height: "100%",
      }}
    >
      <Box
        sx={{
          position: "relative",
          overflow: "hidden",
          height: 240,
          borderRadius: 2,
        }}
      >
        <Box
          component="img"
          src={animal.imageUrl}
          alt={animal.name}
          sx={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transition: "transform 0.4s ease",
            ":hover": {
              transform: "scale(1.04)",
            },
          }}
        />
        <IconButton
          size="small"
          variant="ghost"
          aria-label={t("labels.favorite")}
          sx={{ position: "absolute", top: 12, right: 12, backgroundColor: (theme) => alpha(theme.palette.common.white, 0.9) }}
        >
          <FavoriteBorderRoundedIcon fontSize="small" color="action" />
        </IconButton>
        <StatusChip
          status={animal.status}
          sx={{
            position: "absolute",
            bottom: 12,
            left: 12,
            fontWeight: 800,
            boxShadow: theme.shadows[2],
          }}
        />
      </Box>
      <CardContent sx={{ p: 2.5 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
          <Typography variant="h6" component="h3" sx={{ fontWeight: 800 }}>
            {animal.name}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
            {animal.age}
          </Typography>
        </Stack>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          {animal.breed} • {animal.gender}
        </Typography>
        <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 1.5 }} color="text.secondary">
          <LocationOnRoundedIcon fontSize="small" />
          <Typography variant="body2">{animal.location}</Typography>
        </Stack>
      </CardContent>
    </Card>
  );
}
