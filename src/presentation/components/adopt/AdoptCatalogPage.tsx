"use client";

import FavoriteBorderRoundedIcon from "@mui/icons-material/FavoriteBorderRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import {
  Alert,
  Box,
  Card,
  CardContent,
  Chip as MuiChip,
  CircularProgress,
  Container,
  Divider,
  FormControl,
  FormControlLabel,
  InputAdornment,
  InputLabel,
  MenuItem,
  Pagination,
  Select,
  Stack,
  Switch,
  TextField,
  Typography,
  alpha,
  useTheme,
} from "@mui/material";
import NextLink from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { useMemo, useRef, useState, useCallback, useEffect } from "react";

import type { AdoptCatalogItem } from "@/domain/models/AdoptCatalogItem";
import type {
  GetAdoptCatalogFilters,
  GetAdoptCatalogResult,
} from "@/domain/repositories/IAnimalRepository";
import { GetAdoptCatalogUseCase } from "@/domain/usecases/adopt/GetAdoptCatalogUseCase";
import { appContainer } from "@/infrastructure/ioc/container";
import { USE_CASE_TYPES } from "@/infrastructure/ioc/usecases/usecases.types";
import { Button } from "@/presentation/components/atoms";
import { HomeFooter } from "@/presentation/components/home/HomeFooter";
import { HomeNavBar } from "@/presentation/components/organisms";

type AdoptErrorKey = "errors.unauthorized" | "errors.connection" | "errors.generic";

type SpeciesFilter = "all" | "dog" | "cat" | "other";
type AgeFilter = "all" | "puppy" | "young" | "adult" | "senior";
type SizeFilter = "all" | "small" | "medium" | "large";
type SortOption = "newest" | "oldest" | "urgent";

function truncate(text: string, maxLen: number) {
  const normalized = text.trim();
  if (normalized.length <= maxLen) return normalized;
  return `${normalized.slice(0, maxLen).trimEnd()}…`;
}

export function AdoptCatalogPage() {
  const theme = useTheme();
  const t = useTranslations("adopt");
  const common = useTranslations("common");
  const locale = useLocale();

  const getAdoptCatalogUseCase = useMemo(
    () => appContainer.get<GetAdoptCatalogUseCase>(USE_CASE_TYPES.GetAdoptCatalogUseCase),
    [],
  );

  const requestCounterRef = useRef(0);

  const [urgentOnly, setUrgentOnly] = useState(false);
  const [species, setSpecies] = useState<SpeciesFilter>("all");
  const [age, setAge] = useState<AgeFilter>("all");
  const [size, setSize] = useState<SizeFilter>("all");
  const [searchValue, setSearchValue] = useState("");
  const [sort, setSort] = useState<SortOption>("newest");
  const [page, setPage] = useState(1);

  const [items, setItems] = useState<AdoptCatalogItem[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [errorKey, setErrorKey] = useState<AdoptErrorKey | null>(null);

  const pageSize = 9;

  const resolveErrorKey = useCallback((error: unknown): AdoptErrorKey => {
    if (error instanceof Error) {
      const key = error.message as AdoptErrorKey;
      if (key === "errors.unauthorized" || key === "errors.connection" || key === "errors.generic") {
        return key;
      }
    }
    return "errors.generic";
  }, []);

  const buildFilters = useCallback((): GetAdoptCatalogFilters => {
    const filters: GetAdoptCatalogFilters = { sort };

    if (urgentOnly) filters.urgentOnly = true;
    if (species !== "all") filters.species = species;
    if (age !== "all") filters.age = age;
    if (size !== "all") filters.size = size;

    const search = searchValue.trim();
    if (search.length > 0) filters.search = search;

    return filters;
  }, [age, searchValue, size, sort, species, urgentOnly]);

  const loadCatalog = useCallback(
    async (input: { filters: GetAdoptCatalogFilters; page: number }) => {
      const requestId = ++requestCounterRef.current;
      setIsLoading(true);
      setErrorKey(null);

      try {
        const result: GetAdoptCatalogResult = await getAdoptCatalogUseCase.execute({
          filters: input.filters,
          pagination: { page: input.page, pageSize },
        });

        if (requestId !== requestCounterRef.current) return;

        setItems(result.items);
        setTotal(result.total);
      } catch (error) {
        if (requestId !== requestCounterRef.current) return;

        setItems([]);
        setTotal(0);
        setErrorKey(resolveErrorKey(error));
      } finally {
        if (requestId === requestCounterRef.current) {
          setIsLoading(false);
        }
      }
    },
    [getAdoptCatalogUseCase, pageSize, resolveErrorKey],
  );

  const filters = useMemo(() => buildFilters(), [buildFilters]);

  useEffect(() => {
    void loadCatalog({ filters, page });
  }, [filters, loadCatalog, page]);

  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(page, pageCount);
  const from = total === 0 ? 0 : (safePage - 1) * pageSize + 1;
  const to = total === 0 ? 0 : Math.min(safePage * pageSize, total);

  const renderAgeLabel = (ageMonths: number | null) => {
    if (ageMonths === null) return t("labels.ageUnknown");
    if (ageMonths < 12) return t("age.months", { count: ageMonths });
    const years = Math.floor(ageMonths / 12);
    return t("age.years", { count: Math.max(1, years) });
  };

  const renderSizeLabel = (value: AdoptCatalogItem["size"]) => {
    if (value === "small") return t("filters.size.small");
    if (value === "medium") return t("filters.size.medium");
    if (value === "large") return t("filters.size.large");
    return t("labels.sizeUnknown");
  };

  const renderSexLabel = (value: AdoptCatalogItem["sex"]) => {
    if (value === "male") return t("sex.male");
    if (value === "female") return t("sex.female");
    return t("sex.unknown");
  };

  return (
    <Box className="bg-slate-50">
      <HomeNavBar />

      <Box component="section" className="bg-white">
        <Container maxWidth="xl" sx={{ maxWidth: 1440, px: { xs: 3, sm: 4 }, py: { xs: 5, md: 7 } }}>
          <Stack spacing={1.25}>
            <Typography variant="h3" sx={{ fontWeight: 900, letterSpacing: -0.5 }}>
              {t("hero.title")}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 760, lineHeight: 1.7 }}>
              {t("hero.subtitle")}
            </Typography>
          </Stack>
        </Container>
        <Divider />
      </Box>

      <Container maxWidth="xl" sx={{ maxWidth: 1440, px: { xs: 3, sm: 4 }, py: { xs: 4, md: 6 } }}>
        <Box className="grid gap-6 lg:grid-cols-[320px_1fr]">
          <Box
            component="aside"
            sx={{
              position: { lg: "sticky" },
              top: { lg: 96 },
              alignSelf: "flex-start",
            }}
          >
            <Card sx={{ borderRadius: 2, border: "1px solid", borderColor: "divider", boxShadow: theme.shadows[2] }}>
              <CardContent sx={{ p: 2.75 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 900, mb: 2 }}>
                  {t("filters.title")}
                </Typography>

                <Stack spacing={2.25}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={urgentOnly}
                        onChange={(e) => {
                          setUrgentOnly(e.target.checked);
                          setPage(1);
                        }}
                      />
                    }
                    label={t("filters.urgent")}
                  />

                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 900, mb: 1 }}>
                      {t("filters.species.label")}
                    </Typography>
                    <FormControl fullWidth size="small">
                      <Select
                        value={species}
                        onChange={(e) => {
                          setSpecies(e.target.value as SpeciesFilter);
                          setPage(1);
                        }}
                      >
                        <MenuItem value="all">{t("filters.species.all")}</MenuItem>
                        <MenuItem value="dog">{t("filters.species.dog")}</MenuItem>
                        <MenuItem value="cat">{t("filters.species.cat")}</MenuItem>
                        <MenuItem value="other">{t("filters.species.other")}</MenuItem>
                      </Select>
                    </FormControl>
                  </Box>

                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 900, mb: 1 }}>
                      {t("filters.age.label")}
                    </Typography>
                    <FormControl fullWidth size="small">
                      <Select
                        value={age}
                        onChange={(e) => {
                          setAge(e.target.value as AgeFilter);
                          setPage(1);
                        }}
                      >
                        <MenuItem value="all">{t("filters.age.all")}</MenuItem>
                        <MenuItem value="puppy">{t("filters.age.puppy")}</MenuItem>
                        <MenuItem value="young">{t("filters.age.young")}</MenuItem>
                        <MenuItem value="adult">{t("filters.age.adult")}</MenuItem>
                        <MenuItem value="senior">{t("filters.age.senior")}</MenuItem>
                      </Select>
                    </FormControl>
                  </Box>

                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 900, mb: 1 }}>
                      {t("filters.size.label")}
                    </Typography>
                    <FormControl fullWidth size="small">
                      <Select
                        value={size}
                        onChange={(e) => {
                          setSize(e.target.value as SizeFilter);
                          setPage(1);
                        }}
                      >
                        <MenuItem value="all">{t("filters.size.all")}</MenuItem>
                        <MenuItem value="small">{t("filters.size.small")}</MenuItem>
                        <MenuItem value="medium">{t("filters.size.medium")}</MenuItem>
                        <MenuItem value="large">{t("filters.size.large")}</MenuItem>
                      </Select>
                    </FormControl>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Box>

          <Box>
            <Card sx={{ borderRadius: 2, border: "1px solid", borderColor: "divider", boxShadow: theme.shadows[2] }}>
              <CardContent sx={{ p: 2.75 }}>
                <Box className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <TextField
                    value={searchValue}
                    onChange={(e) => {
                      setSearchValue(e.target.value);
                      setPage(1);
                    }}
                    placeholder={t("search.placeholder")}
                    size="small"
                    className="w-full md:flex-1"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchRoundedIcon fontSize="small" />
                        </InputAdornment>
                      ),
                    }}
                  />

                  <FormControl size="small" className="w-full md:w-[240px]">
                    <InputLabel id="adopt-sort-label">{t("sort.label")}</InputLabel>
                    <Select
                      labelId="adopt-sort-label"
                      value={sort}
                      label={t("sort.label")}
                      onChange={(e) => {
                        setSort(e.target.value as SortOption);
                        setPage(1);
                      }}
                    >
                      <MenuItem value="newest">{t("sort.newest")}</MenuItem>
                      <MenuItem value="oldest">{t("sort.oldest")}</MenuItem>
                      <MenuItem value="urgent">{t("sort.urgent")}</MenuItem>
                    </Select>
                  </FormControl>
                </Box>

                {errorKey ? (
                  <Alert severity="error" sx={{ mt: 3 }}>
                    {t(errorKey)}
                  </Alert>
                ) : null}

                {isLoading ? (
                  <Box className="flex justify-center py-12">
                    <CircularProgress aria-label={t("states.loading")} />
                  </Box>
                ) : total === 0 ? (
                  <Box className="py-12 text-center">
                    <Typography variant="h6" sx={{ fontWeight: 900 }}>
                      {t("states.emptyTitle")}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                      {t("states.emptySubtitle")}
                    </Typography>
                  </Box>
                ) : (
                  <Box className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {items.map((animal) => {
                      const imageUrl = animal.coverImageUrl || "/file.svg";
                      const ageLabel = renderAgeLabel(animal.ageMonths);
                      const sizeLabel = renderSizeLabel(animal.size);
                      const sexLabel = renderSexLabel(animal.sex);

                      return (
                        <Card
                          key={animal.id}
                          sx={{
                            borderRadius: 2,
                            border: "1px solid",
                            borderColor: "divider",
                            boxShadow: theme.shadows[2],
                            transition: "transform 0.2s ease, box-shadow 0.2s ease",
                            ":hover": { transform: "translateY(-4px)", boxShadow: theme.shadows[3] },
                            height: "100%",
                            overflow: "hidden",
                          }}
                        >
                          <Box sx={{ position: "relative", height: 220, overflow: "hidden" }}>
                            <Box
                              component="img"
                              src={imageUrl}
                              alt={animal.name}
                              sx={{
                                width: "100%",
                                height: "100%",
                                objectFit: animal.coverImageUrl ? "cover" : "contain",
                                backgroundColor: alpha(theme.palette.background.paper, 0.8),
                                transition: "transform 0.4s ease",
                                ":hover": { transform: "scale(1.04)" },
                              }}
                            />

                            <Button
                              size="small"
                              variant="ghost"
                              tone="neutral"
                              aria-label={common("labels.favorite")}
                              sx={{
                                position: "absolute",
                                top: 12,
                                right: 12,
                                minWidth: 0,
                                px: 1.25,
                                backgroundColor: alpha(theme.palette.common.white, 0.92),
                              }}
                            >
                              <FavoriteBorderRoundedIcon fontSize="small" />
                            </Button>

                            <Stack direction="row" spacing={1} sx={{ position: "absolute", left: 12, bottom: 12 }}>
                              {animal.isUrgent ? (
                                <MuiChip
                                  label={t("badges.urgent")}
                                  size="small"
                                  sx={{
                                    fontWeight: 900,
                                    backgroundColor: theme.palette.error.main,
                                    color: theme.palette.error.contrastText,
                                    boxShadow: theme.shadows[2],
                                  }}
                                />
                              ) : null}
                              <MuiChip
                                label={sexLabel}
                                size="small"
                                sx={{
                                  fontWeight: 900,
                                  backgroundColor: alpha(theme.palette.common.white, 0.92),
                                  boxShadow: theme.shadows[2],
                                }}
                              />
                            </Stack>
                          </Box>

                          <CardContent sx={{ p: 2.5 }}>
                            <Stack spacing={1.25}>
                              <Stack spacing={0.25}>
                                <Typography variant="h6" sx={{ fontWeight: 900, lineHeight: 1.2 }}>
                                  {animal.name}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  {truncate(animal.description, 92)}
                                </Typography>
                              </Stack>

                              <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 700 }}>
                                {t("card.meta", { age: ageLabel, size: sizeLabel })}
                              </Typography>

                              <Stack direction="row" spacing={1.25} sx={{ pt: 0.75 }}>
                                <Button fullWidth rounded="pill" sx={{ fontWeight: 900 }}>
                                  {t("buttons.adopt")}
                                </Button>
                                <Button
                                  fullWidth
                                  tone="neutral"
                                  variant="outlined"
                                  rounded="pill"
                                  component={NextLink}
                                  href={`/${locale}/adopt/${animal.id}`}
                                  sx={{ fontWeight: 900 }}
                                >
                                  {t("buttons.details")}
                                </Button>
                              </Stack>
                            </Stack>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </Box>
                )}

                {total > 0 ? (
                  <Box className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <Typography variant="body2" color="text.secondary">
                      {t("pagination.showing", { from, to, total })}
                    </Typography>
                    <Pagination
                      count={pageCount}
                      page={safePage}
                      onChange={(_, next) => setPage(next)}
                      color="primary"
                      shape="rounded"
                      siblingCount={1}
                      boundaryCount={1}
                    />
                  </Box>
                ) : null}
              </CardContent>
            </Card>
          </Box>
        </Box>
      </Container>

      <HomeFooter />
    </Box>
  );
}

