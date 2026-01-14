"use client";

import HistoryRoundedIcon from "@mui/icons-material/HistoryRounded";
import { Box, Stack, Typography, useTheme } from "@mui/material";
import { useTranslations } from "next-intl";

export function AdoptHistory() {
  const theme = useTheme();
  const t = useTranslations("adoptDetail");

  return (
    <Box
      sx={{
        mt: { xs: 6, md: 8 },
        borderRadius: 3,
        border: "1px solid",
        borderColor: "divider",
        backgroundColor: theme.palette.background.paper,
        boxShadow: theme.shadows[1],
        p: { xs: 3, md: 4 },
      }}
    >
      <Stack spacing={1.5}>
        <Stack direction="row" spacing={1} alignItems="center">
          <HistoryRoundedIcon color="secondary" fontSize="small" />
          <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
            {t("history.title")}
          </Typography>
        </Stack>
        <Typography variant="body2" color="text.secondary">
          {t("history.empty")}
        </Typography>
      </Stack>
    </Box>
  );
}
