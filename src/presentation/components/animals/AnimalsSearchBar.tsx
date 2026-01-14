"use client";

import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import {
  Box,
  FormControl,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  type SelectChangeEvent,
  TextField,
} from "@mui/material";
import { useTranslations } from "next-intl";

import type { AnimalManagementSpecies, AnimalManagementStatus } from "@/domain/models/AnimalManagement";
import type { AnimalsSortOption as RepoAnimalsSortOption } from "@/domain/repositories/IAnimalRepository";

export type AnimalsStatusFilter = "all" | AnimalManagementStatus;
export type AnimalsSpeciesFilter = "all" | AnimalManagementSpecies;
export type AnimalsSortOption = RepoAnimalsSortOption;

export interface AnimalsSearchBarProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  status: AnimalsStatusFilter;
  onStatusChange: (value: AnimalsStatusFilter) => void;
  species: AnimalsSpeciesFilter;
  onSpeciesChange: (value: AnimalsSpeciesFilter) => void;
  sort: AnimalsSortOption;
  onSortChange: (value: AnimalsSortOption) => void;
}

export function AnimalsSearchBar({
  searchValue,
  onSearchChange,
  status,
  onStatusChange,
  species,
  onSpeciesChange,
  sort,
  onSortChange,
}: AnimalsSearchBarProps) {
  const t = useTranslations("animals");

  const handleSelect =
    <T extends string>(setter: (value: T) => void) =>
    (event: SelectChangeEvent<T>) => {
      setter(event.target.value as T);
    };

  return (
    <Box className="flex flex-col gap-3 md:flex-row md:items-center">
      <TextField
        id="animals-search-input"
        value={searchValue}
        onChange={(event) => onSearchChange(event.target.value)}
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

      <Box className="grid w-full grid-cols-1 gap-3 sm:grid-cols-3 md:w-auto md:grid-cols-3">
        <FormControl size="small" className="w-full md:min-w-[170px]">
          <InputLabel id="animals-status-filter-label">{t("filters.status.label")}</InputLabel>
          <Select
            labelId="animals-status-filter-label"
            value={status}
            label={t("filters.status.label")}
            onChange={handleSelect(onStatusChange)}
          >
            <MenuItem value="all">{t("filters.status.all")}</MenuItem>
            <MenuItem value="available">{t("filters.status.available")}</MenuItem>
            <MenuItem value="adopted">{t("filters.status.adopted")}</MenuItem>
            <MenuItem value="pending">{t("filters.status.pending")}</MenuItem>
            <MenuItem value="in_treatment">{t("filters.status.in_treatment")}</MenuItem>
            <MenuItem value="inactive">{t("filters.status.inactive")}</MenuItem>
          </Select>
        </FormControl>

        <FormControl size="small" className="w-full md:min-w-[170px]">
          <InputLabel id="animals-species-filter-label">{t("filters.species.label")}</InputLabel>
          <Select
            labelId="animals-species-filter-label"
            value={species}
            label={t("filters.species.label")}
            onChange={handleSelect(onSpeciesChange)}
          >
            <MenuItem value="all">{t("filters.species.all")}</MenuItem>
            <MenuItem value="dog">{t("filters.species.dog")}</MenuItem>
            <MenuItem value="cat">{t("filters.species.cat")}</MenuItem>
            <MenuItem value="bird">{t("filters.species.bird")}</MenuItem>
            <MenuItem value="other">{t("filters.species.other")}</MenuItem>
          </Select>
        </FormControl>

        <FormControl size="small" className="w-full md:min-w-[190px]">
          <InputLabel id="animals-sort-filter-label">{t("filters.sort.label")}</InputLabel>
          <Select
            labelId="animals-sort-filter-label"
            value={sort}
            label={t("filters.sort.label")}
            onChange={handleSelect(onSortChange)}
          >
            <MenuItem value="newest">{t("filters.sort.newest")}</MenuItem>
            <MenuItem value="oldest">{t("filters.sort.oldest")}</MenuItem>
            <MenuItem value="nameAsc">{t("filters.sort.nameAsc")}</MenuItem>
            <MenuItem value="nameDesc">{t("filters.sort.nameDesc")}</MenuItem>
          </Select>
        </FormControl>
      </Box>
    </Box>
  );
}

