import FavoriteBorderRoundedIcon from "@mui/icons-material/FavoriteBorderRounded";
import LocationOnRoundedIcon from "@mui/icons-material/LocationOnRounded";
import { Box, Card, CardContent, Chip, IconButton, Stack, Typography } from "@mui/material";

import type { Animal } from "@/domain/models/Animal";

const statusColorMap: Record<Animal["status"], string> = {
  Adopción: "#1cb0f6",
  Apadrinamiento: "#f97316",
  Urgente: "#9333ea",
};

interface AnimalCardProps {
  animal: Animal;
}

export function AnimalCard({ animal }: AnimalCardProps) {
  return (
    <Card
      sx={{
        borderRadius: 2,
        border: "1px solid",
        borderColor: "divider",
        boxShadow: "0 10px 30px rgba(15, 23, 42, 0.05)",
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
        ":hover": {
          transform: "translateY(-4px)",
          boxShadow: "0 15px 40px rgba(15, 23, 42, 0.08)",
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
          sx={{
            position: "absolute",
            top: 12,
            right: 12,
            backgroundColor: "rgba(255,255,255,0.85)",
          }}
        >
          <FavoriteBorderRoundedIcon fontSize="small" color="action" />
        </IconButton>
        <Chip
          label={animal.status}
          size="small"
          sx={{
            position: "absolute",
            bottom: 12,
            left: 12,
            backgroundColor: statusColorMap[animal.status],
            color: "#fff",
            fontWeight: 700,
            textTransform: "none",
            boxShadow: "0 10px 20px rgba(0,0,0,0.15)",
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
