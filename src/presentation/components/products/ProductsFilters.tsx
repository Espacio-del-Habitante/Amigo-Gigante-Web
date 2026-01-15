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

import type { ProductPriceRangeFilter, ProductStatusFilter } from "@/domain/repositories/IProductRepository";

export type ProductsStatusFilter = "all" | ProductStatusFilter;
export type ProductsPriceFilter = "all" | ProductPriceRangeFilter;

export interface ProductsFiltersProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  status: ProductsStatusFilter;
  onStatusChange: (value: ProductsStatusFilter) => void;
  priceRange: ProductsPriceFilter;
  onPriceRangeChange: (value: ProductsPriceFilter) => void;
}

export function ProductsFilters({
  searchValue,
  onSearchChange,
  status,
  onStatusChange,
  priceRange,
  onPriceRangeChange,
}: ProductsFiltersProps) {
  const t = useTranslations("products");

  const handleSelect =
    <T extends string>(setter: (value: T) => void) =>
    (event: SelectChangeEvent<T>) => {
      setter(event.target.value as T);
    };

  return (
    <Box className="flex flex-col gap-3 md:flex-row md:items-center">
      <TextField
        id="products-search-input"
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

      <Box className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2 md:w-auto md:grid-cols-2">
        <FormControl size="small" className="w-full md:min-w-[170px]">
          <InputLabel id="products-status-filter-label">{t("filters.status.label")}</InputLabel>
          <Select
            labelId="products-status-filter-label"
            value={status}
            label={t("filters.status.label")}
            onChange={handleSelect(onStatusChange)}
          >
            <MenuItem value="all">{t("filters.status.all")}</MenuItem>
            <MenuItem value="published">{t("filters.status.published")}</MenuItem>
            <MenuItem value="draft">{t("filters.status.draft")}</MenuItem>
          </Select>
        </FormControl>

        <FormControl size="small" className="w-full md:min-w-[190px]">
          <InputLabel id="products-price-filter-label">{t("filters.price.label")}</InputLabel>
          <Select
            labelId="products-price-filter-label"
            value={priceRange}
            label={t("filters.price.label")}
            onChange={handleSelect(onPriceRangeChange)}
          >
            <MenuItem value="all">{t("filters.price.all")}</MenuItem>
            <MenuItem value="under_10">{t("filters.price.under10")}</MenuItem>
            <MenuItem value="between_10_25">{t("filters.price.between10And25")}</MenuItem>
            <MenuItem value="over_25">{t("filters.price.over25")}</MenuItem>
          </Select>
        </FormControl>
      </Box>
    </Box>
  );
}
