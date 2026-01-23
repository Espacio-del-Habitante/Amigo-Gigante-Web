import FilterAltRoundedIcon from "@mui/icons-material/FilterAltRounded";
import PetsRoundedIcon from "@mui/icons-material/PetsRounded";
import VolunteerActivismRoundedIcon from "@mui/icons-material/VolunteerActivismRounded";
import {
  Box,
  Card,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import Image from "next/image";
import { useCallback, useMemo, useState } from "react";
import { useTranslations } from "next-intl";

import type { Animal } from "@/domain/models/Animal";
import { Button, Chip } from "@/presentation/components/atoms";
import { useHomeNavigation } from "@/presentation/components/home/hooks/useHomeNavigation";

interface HeroSectionProps {
  heroAnimals: Animal[];
}

export function HeroSection({ heroAnimals }: HeroSectionProps) {
  const [first, second] = heroAnimals;
  const theme = useTheme();
  const t = useTranslations("home");
  const common = useTranslations("common");
  const isSmDown = useMediaQuery(theme.breakpoints.down("sm"));
  const { goToAdopt, goToAdoptDetail } = useHomeNavigation();
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [locationValue, setLocationValue] = useState("");
  const [selectedSpecies, setSelectedSpecies] = useState<string | null>(null);
  const filterTags = useMemo(
    () => [
      { key: "dog", label: t("filters.tags.dogs") },
      { key: "cat", label: t("filters.tags.cats") },
      { key: "sponsor", label: t("filters.tags.sponsor") },
    ],
    [t],
  );

  const handleSearch = useCallback(() => {
    goToAdopt({
      search: searchValue,
      species: selectedSpecies ?? undefined,
      location: locationValue,
    });
  }, [goToAdopt, locationValue, searchValue, selectedSpecies]);

  const handleAnimalClick = useCallback(
    (animalId: number) => {
      goToAdoptDetail(animalId);
    },
    [goToAdoptDetail],
  );

  return (
    <Box component="section" className="relative overflow-hidden bg-gradient-to-br from-neutral-50 to-white pb-12 pt-16 md:pb-16 md:pt-20">
      <Container
        maxWidth="xl"
        className="grid items-center gap-8 md:grid-cols-2"
        sx={{ maxWidth: 1440, px: { xs: 3, sm: 4 } }}
      >
        <Stack className="gap-6">
          <Chip
            icon={<PetsRoundedIcon />}
            label={t("hero.badge")}
            tone="brand"
            variant="soft"
            sx={{ alignSelf: "flex-start" }}
          />
          <Box>
            <Typography
              variant="h2"
              sx={{
                fontSize: { xs: "2.5rem", md: "3rem", lg: "3.4rem" },
                fontWeight: 900,
                lineHeight: 1.1,
                color: "text.primary",
              }}
            >
              {t("hero.title")}
              <br />
              <Box component="span" sx={{ color: "primary.main", position: "relative" }}>
                {t("hero.highlight")}
              </Box>
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mt: 2, maxWidth: 560, lineHeight: 1.7 }}>
              {t("hero.subtitle")}
            </Typography>
          </Box>
          <Box
            className="flex flex-col gap-3 rounded-2xl border border-solid bg-white p-4"
            sx={{ maxWidth: 720, borderColor: "divider", boxShadow: 3 }}
          >
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems="center">
              <Stack direction="row" spacing={1.5} alignItems="center" sx={{ width: { xs: "100%", sm: "100%" } }}>
                <TextField
                  placeholder={t("hero.searchPlaceholder")}
                  fullWidth
                  size="small"
                  value={searchValue}
                  onChange={(event) => setSearchValue(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      event.preventDefault();
                      handleSearch();
                    }
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                      "& fieldset": { borderColor: theme.palette.divider },
                      "&:hover fieldset": { borderColor: theme.palette.primary.main },
                      "&.Mui-focused fieldset": {
                        borderColor: theme.palette.primary.main,
                        boxShadow: `${theme.shadows[1]}, 0 0 0 3px ${theme.palette.primary.main}22`,
                      },
                    },
                  }}
                />
                <IconButton
                  aria-label={common("labels.openFilters")}
                  onClick={() => setFiltersOpen(true)}
                  sx={{
                    borderRadius: 2,
                    backgroundColor: theme.palette.background.default,
                    "&:hover": { backgroundColor: theme.palette.action.hover },
                    flexShrink: 0,
                  }}
                >
                  <FilterAltRoundedIcon />
                </IconButton>
              </Stack>
              <Button
                fullWidth={isSmDown}
                rounded="pill"
                onClick={handleSearch}
                sx={{ boxShadow: 2, fontWeight: 800, px: 3.5, minWidth: 130, flexShrink: 0 }}
              >
                {common("buttons.search")}
              </Button>
            </Stack>
          </Box>
        </Stack>
        <Box className="grid items-start gap-4 sm:grid-cols-2 md:gap-6">
          <Stack className="gap-3 sm:mt-4">
            {first && (
              <Card
                sx={{
                  borderRadius: 2,
                  overflow: "hidden",
                  boxShadow: 2,
                  border: "1px solid",
                  borderColor: "divider",
                  cursor: "pointer",
                }}
                role="button"
                tabIndex={0}
                onClick={() => handleAnimalClick(first.id)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    handleAnimalClick(first.id);
                  }
                }}
                aria-label={t("hero.animalAriaLabel", { name: first.name })}
              >
                <Box sx={{ position: "relative", height: 240 }}>
                  <Image
                    src={first.imageUrl}
                    alt={first.name}
                    fill
                    priority
                    style={{ objectFit: "cover" }}
                    sizes="(max-width: 900px) 100vw, (max-width: 1280px) 50vw, 620px"
                  />
                </Box>
              </Card>
            )}
            <Card className="flex items-center gap-3 rounded-2xl border border-solid p-3" sx={{ borderColor: "divider", boxShadow: 2 }}>
              <Chip
                icon={<PetsRoundedIcon color="secondary" />}
                label={t("hero.verified")}
                tone="accent"
                variant="soft"
              />
            </Card>
          </Stack>
          <Stack className="gap-3">
            <Card
              sx={{
                backgroundColor: "secondary.main",
                color: "common.white",
                borderRadius: 2,
                p: 3,
                minHeight: 140,
                boxShadow: 3,
              }}
            >
              <VolunteerActivismRoundedIcon sx={{ fontSize: 36, mb: 1 }} />
              <Typography variant="h6" sx={{ fontWeight: 800, lineHeight: 1.3 }}>
                {t("hero.sponsorCard")}
              </Typography>
            </Card>
            {second && (
              <Card
                sx={{
                  borderRadius: 2,
                  overflow: "hidden",
                  boxShadow: 2,
                  border: "1px solid",
                  borderColor: "divider",
                  cursor: "pointer",
                }}
                role="button"
                tabIndex={0}
                onClick={() => handleAnimalClick(second.id)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    handleAnimalClick(second.id);
                  }
                }}
                aria-label={t("hero.animalAriaLabel", { name: second.name })}
              >
                <Box sx={{ position: "relative", height: 240 }}>
                  <Image
                    src={second.imageUrl}
                    alt={second.name}
                    fill
                    style={{ objectFit: "cover" }}
                    sizes="(max-width: 900px) 100vw, (max-width: 1280px) 50vw, 620px"
                  />
                </Box>
              </Card>
            )}
          </Stack>
        </Box>
      </Container>
      <Dialog open={filtersOpen} onClose={() => setFiltersOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle sx={{ fontWeight: 800, pb: 1 }}>{t("filters.title")}</DialogTitle>
        <DialogContent dividers sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Stack spacing={1}>
            <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
              {t("filters.typeLabel")}
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap">
              {filterTags.map((tag) => {
                const isSelected = selectedSpecies === tag.key;
                return (
                  <Chip
                    key={tag.key}
                    label={tag.label}
                    tone={isSelected ? "brand" : "neutral"}
                    variant={isSelected ? "solid" : "soft"}
                    onClick={() => setSelectedSpecies(isSelected ? null : tag.key)}
                    sx={{ mb: 1 }}
                  />
                );
              })}
            </Stack>
          </Stack>
          <Stack spacing={1}>
            <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
              {t("filters.locationLabel")}
            </Typography>
            <TextField
              placeholder={t("filters.locationPlaceholder")}
              fullWidth
              value={locationValue}
              onChange={(event) => setLocationValue(event.target.value)}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button variant="ghost" tone="neutral" onClick={() => setFiltersOpen(false)}>
            {common("buttons.cancel")}
          </Button>
          <Button rounded="pill" onClick={() => setFiltersOpen(false)} sx={{ fontWeight: 800 }}>
            {common("buttons.applyFilters")}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
