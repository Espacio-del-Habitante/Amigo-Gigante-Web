"use client";

import AddRoundedIcon from "@mui/icons-material/AddRounded";
import { Alert, Box, Button, CircularProgress, Typography } from "@mui/material";
import { useTranslations } from "next-intl";
import { useEffect, useMemo, useState } from "react";

import type { AnimalManagement } from "@/domain/models/AnimalManagement";
import type { GetAnimalsFilters } from "@/domain/repositories/IAnimalRepository";
import { GetAnimalsUseCase } from "@/domain/usecases/animals/GetAnimalsUseCase";
import { appContainer } from "@/infrastructure/ioc/container";
import { USE_CASE_TYPES } from "@/infrastructure/ioc/usecases/usecases.types";
import { AnimalsPagination } from "@/presentation/components/animals/AnimalsPagination";
import {
  AnimalsSearchBar,
  type AnimalsSpeciesFilter,
  type AnimalsSortOption,
  type AnimalsStatusFilter,
} from "@/presentation/components/animals/AnimalsSearchBar";
import { AnimalsTable } from "@/presentation/components/animals/AnimalsTable";

export function AnimalsManagementPage() {
  const t = useTranslations("animals");
  const getAnimalsUseCase = useMemo(
    () => appContainer.get<GetAnimalsUseCase>(USE_CASE_TYPES.GetAnimalsUseCase),
    [],
  );

  const animalsErrorKeyList = ["errors.unauthorized", "errors.connection", "errors.generic"] as const;
  type AnimalsErrorKey = (typeof animalsErrorKeyList)[number];
  const animalsErrorKeys = useMemo(() => new Set<AnimalsErrorKey>(animalsErrorKeyList), []);

  const [searchValue, setSearchValue] = useState("");
  const [status, setStatus] = useState<AnimalsStatusFilter>("all");
  const [species, setSpecies] = useState<AnimalsSpeciesFilter>("all");
  const [sort, setSort] = useState<AnimalsSortOption>("newest");
  const [page, setPage] = useState(1);
  const [animals, setAnimals] = useState<AnimalManagement[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [errorKey, setErrorKey] = useState<AnimalsErrorKey | null>(null);

  const pageSize = 5;

  const resolveErrorMessage = (error: unknown): AnimalsErrorKey => {
    if (error instanceof Error) {
      const candidate = error.message as AnimalsErrorKey;
      if (animalsErrorKeys.has(candidate)) {
        return candidate;
      }
    }

    return "errors.generic";
  };

  const buildFilters = (): GetAnimalsFilters => {
    const filters: GetAnimalsFilters = { sort };

    if (status !== "all") {
      filters.status = status;
    }

    if (species !== "all") {
      filters.species = species;
    }

    const search = searchValue.trim();
    if (search.length > 0) {
      filters.search = search;
    }

    return filters;
  };

  const loadAnimals = async (nextPage: number) => {
    setIsLoading(true);
    setErrorKey(null);

    try {
      const result = await getAnimalsUseCase.execute({
        filters: buildFilters(),
        pagination: { page: nextPage, pageSize },
      });

      setAnimals(result.animals);
      setTotal(result.total);
    } catch (error) {
      setAnimals([]);
      setTotal(0);
      setErrorKey(resolveErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchChange = (value: string) => {
    setSearchValue(value);
    setPage(1);
    void loadAnimals(1);
  };

  const handleStatusChange = (value: AnimalsStatusFilter) => {
    setStatus(value);
    setPage(1);
    void loadAnimals(1);
  };

  const handleSpeciesChange = (value: AnimalsSpeciesFilter) => {
    setSpecies(value);
    setPage(1);
    void loadAnimals(1);
  };

  const handleSortChange = (value: AnimalsSortOption) => {
    setSort(value);
    setPage(1);
    void loadAnimals(1);
  };

  useEffect(() => {
    void loadAnimals(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Box className="flex w-full flex-col gap-6">
      <Box className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <Box className="flex flex-col gap-1">
          <Typography variant="h4" sx={{ fontWeight: 900 }}>
            {t("title")}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {t("subtitle")}
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddRoundedIcon />}
          className="w-full md:w-auto"
          aria-label={t("addButton")}
        >
          {t("addButton")}
        </Button>
      </Box>

      <AnimalsSearchBar
        searchValue={searchValue}
        onSearchChange={handleSearchChange}
        status={status}
        onStatusChange={handleStatusChange}
        species={species}
        onSpeciesChange={handleSpeciesChange}
        sort={sort}
        onSortChange={handleSortChange}
      />

      {errorKey ? (
        <Alert severity="error">{t(errorKey)}</Alert>
      ) : null}

      {isLoading ? (
        <Box className="flex justify-center py-10">
          <CircularProgress aria-label={t("loading.label")} />
        </Box>
      ) : (
        <AnimalsTable animals={animals} />
      )}

      <AnimalsPagination
        total={total}
        page={page}
        pageSize={pageSize}
        onPageChange={(nextPage) => {
          setPage(nextPage);
          void loadAnimals(nextPage);
        }}
      />
    </Box>
  );
}

