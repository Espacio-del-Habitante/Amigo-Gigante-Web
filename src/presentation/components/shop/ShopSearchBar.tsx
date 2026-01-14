"use client";

import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import { Box, IconButton, MenuItem, Stack, TextField, useTheme } from "@mui/material";
import { useTranslations } from "next-intl";

import type { ShopFoundation } from "@/domain/models/ShopFoundation";

export interface ShopSearchState {
  query: string;
  foundationId: string;
}

export interface ShopSearchBarProps {
  foundations: ShopFoundation[];
  value: ShopSearchState;
  onChange: (next: ShopSearchState) => void;
  onSubmit: () => void;
  isSubmitting?: boolean;
}

export function ShopSearchBar({ foundations, value, onChange, onSubmit, isSubmitting = false }: ShopSearchBarProps) {
  const theme = useTheme();
  const t = useTranslations("shop");

  return (
    <Box
      sx={{
        maxWidth: 860,
        mx: "auto",
        borderRadius: 999,
        p: 1,
        border: "1px solid",
        borderColor: "divider",
        boxShadow: theme.shadows[2],
        backgroundColor: "background.paper",
      }}
    >
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={1}
        alignItems="center"
        sx={{ px: 1.5, py: 0.5 }}
      >
        <Stack direction="row" spacing={1} alignItems="center" sx={{ flex: 1, width: "100%" }}>
          <SearchRoundedIcon sx={{ color: "text.disabled" }} />
          <TextField
            fullWidth
            variant="standard"
            value={value.query}
            onChange={(event) => onChange({ ...value, query: event.target.value })}
            placeholder={t("search.placeholder")}
            InputProps={{ disableUnderline: true }}
            onKeyDown={(event) => {
              if (event.key === "Enter") onSubmit();
            }}
          />
        </Stack>
        <Box
          sx={{
            width: { xs: "100%", sm: 220 },
            borderLeft: { xs: "none", sm: "1px solid" },
            borderColor: { sm: "divider" },
            pl: { xs: 0, sm: 2 },
          }}
        >
          <TextField
            select
            fullWidth
            variant="standard"
            value={value.foundationId}
            onChange={(event) => onChange({ ...value, foundationId: event.target.value })}
            InputProps={{ disableUnderline: true }}
          >
            <MenuItem value="">{t("search.allFoundations")}</MenuItem>
            {foundations.map((foundation) => (
              <MenuItem key={foundation.id} value={foundation.id}>
                {foundation.name}
              </MenuItem>
            ))}
          </TextField>
        </Box>
        <IconButton
          aria-label={t("search.submit")}
          onClick={onSubmit}
          disabled={isSubmitting}
          sx={{
            borderRadius: 999,
            backgroundColor: "primary.main",
            color: "common.white",
            width: { xs: "100%", sm: 44 },
            height: 44,
            "&:hover": { backgroundColor: "primary.dark" },
          }}
        >
          <SearchRoundedIcon />
        </IconButton>
      </Stack>
    </Box>
  );
}

