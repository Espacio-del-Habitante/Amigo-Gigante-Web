"use client";

import AddRoundedIcon from "@mui/icons-material/AddRounded";
import { Box, Button, Typography } from "@mui/material";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";

import {
  animalsManagementMock,
  type AnimalManagement,
  type AnimalManagementSpecies,
  type AnimalManagementStatus,
} from "@/infrastructure/mocks/animals-management.mock";
import { AnimalsPagination } from "@/presentation/components/animals/AnimalsPagination";
import {
  AnimalsSearchBar,
  type AnimalsSpeciesFilter,
  type AnimalsSortOption,
  type AnimalsStatusFilter,
} from "@/presentation/components/animals/AnimalsSearchBar";
import { AnimalsTable } from "@/presentation/components/animals/AnimalsTable";

function formatAnimalIdForSearch(id: number) {
  return `#ag-${String(id).padStart(4, "0")}`;
}

function normalize(value: string) {
  return value.trim().toLowerCase();
}

function isSpeciesMatch(speciesFilter: AnimalsSpeciesFilter, animalSpecies: AnimalManagementSpecies) {
  if (speciesFilter === "all") return true;
  return animalSpecies === speciesFilter;
}

function isStatusMatch(statusFilter: AnimalsStatusFilter, animalStatus: AnimalManagementStatus) {
  if (statusFilter === "all") return true;
  return animalStatus === statusFilter;
}

function sortAnimals(animals: AnimalManagement[], sort: AnimalsSortOption) {
  const sorted = [...animals];

  sorted.sort((a, b) => {
    if (sort === "newest") {
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    }

    if (sort === "oldest") {
      return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
    }

    if (sort === "nameAsc") {
      return a.name.localeCompare(b.name, undefined, { sensitivity: "base" });
    }

    return b.name.localeCompare(a.name, undefined, { sensitivity: "base" });
  });

  return sorted;
}

export function AnimalsManagementPage() {
  const t = useTranslations("animals");

  const [searchValue, setSearchValue] = useState("");
  const [status, setStatus] = useState<AnimalsStatusFilter>("all");
  const [species, setSpecies] = useState<AnimalsSpeciesFilter>("all");
  const [sort, setSort] = useState<AnimalsSortOption>("newest");
  const [page, setPage] = useState(1);

  const pageSize = 5;

  const handleSearchChange = (value: string) => {
    setSearchValue(value);
    setPage(1);
  };

  const handleStatusChange = (value: AnimalsStatusFilter) => {
    setStatus(value);
    setPage(1);
  };

  const handleSpeciesChange = (value: AnimalsSpeciesFilter) => {
    setSpecies(value);
    setPage(1);
  };

  const handleSortChange = (value: AnimalsSortOption) => {
    setSort(value);
    setPage(1);
  };

  const filteredAnimals = useMemo(() => {
    const query = normalize(searchValue);

    const filtered = animalsManagementMock.filter((animal) => {
      if (!isStatusMatch(status, animal.status)) return false;
      if (!isSpeciesMatch(species, animal.species)) return false;

      if (query.length === 0) return true;

      const id = formatAnimalIdForSearch(animal.id);
      const name = normalize(animal.name);
      const breed = normalize(animal.breed);

      return name.includes(query) || breed.includes(query) || id.includes(query);
    });

    return sortAnimals(filtered, sort);
  }, [searchValue, sort, species, status]);

  const pageCount = useMemo(() => Math.max(1, Math.ceil(filteredAnimals.length / pageSize)), [filteredAnimals.length]);

  const effectivePage = Math.min(page, pageCount);

  const pagedAnimals = useMemo(() => {
    const start = (effectivePage - 1) * pageSize;
    return filteredAnimals.slice(start, start + pageSize);
  }, [effectivePage, filteredAnimals, pageSize]);

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

      <AnimalsTable animals={pagedAnimals} />

      <AnimalsPagination total={filteredAnimals.length} page={effectivePage} pageSize={pageSize} onPageChange={setPage} />
    </Box>
  );
}

