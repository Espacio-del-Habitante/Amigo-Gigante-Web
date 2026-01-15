"use client";

import HistoryRoundedIcon from "@mui/icons-material/HistoryRounded";
import { Box, Typography } from "@mui/material";
import { useTranslations } from "next-intl";

export function AdoptHistory() {
  const t = useTranslations("adoptDetail");

  return (
    <Box sx={{ mt: 5 }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
        <HistoryRoundedIcon color="secondary" fontSize="small" />
        <Typography variant="h6" sx={{ fontWeight: 900 }}>
          {t("history.title")}
        </Typography>
      </Box>
      <Typography variant="body2" color="text.secondary">
        {t("history.empty")}
      </Typography>
    </Box>
  );
}
