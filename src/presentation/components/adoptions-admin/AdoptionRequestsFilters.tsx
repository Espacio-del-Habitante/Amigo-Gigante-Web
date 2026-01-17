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

import type { AdoptionRequestPriority, AdoptionRequestStatus } from "@/domain/models/AdoptionRequest";

export type AdoptionRequestStatusFilter = "all" | AdoptionRequestStatus;
export type AdoptionRequestPriorityFilter = "all" | AdoptionRequestPriority;

export interface AdoptionRequestsFiltersProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  status: AdoptionRequestStatusFilter;
  onStatusChange: (value: AdoptionRequestStatusFilter) => void;
  priority: AdoptionRequestPriorityFilter;
  onPriorityChange: (value: AdoptionRequestPriorityFilter) => void;
}

export function AdoptionRequestsFilters({
  searchValue,
  onSearchChange,
  status,
  onStatusChange,
  priority,
  onPriorityChange,
}: AdoptionRequestsFiltersProps) {
  const t = useTranslations("adoptionsAdmin");

  const handleSelect =
    <T extends string>(setter: (value: T) => void) =>
    (event: SelectChangeEvent<T>) => {
      setter(event.target.value as T);
    };

  return (
    <Box className="flex flex-col gap-3 md:flex-row md:items-center">
      <TextField
        id="adoptions-search-input"
        value={searchValue}
        onChange={(event) => onSearchChange(event.target.value)}
        placeholder={t("filters.search.placeholder")}
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
        <FormControl size="small" className="w-full md:min-w-[180px]">
          <InputLabel id="adoptions-status-filter-label">{t("filters.status.label")}</InputLabel>
          <Select
            labelId="adoptions-status-filter-label"
            value={status}
            label={t("filters.status.label")}
            onChange={handleSelect(onStatusChange)}
          >
            <MenuItem value="all">{t("filters.status.all")}</MenuItem>
            <MenuItem value="pending">{t("status.pending")}</MenuItem>
            <MenuItem value="in_review">{t("status.in_review")}</MenuItem>
            <MenuItem value="info_requested">{t("status.info_requested")}</MenuItem>
            <MenuItem value="preapproved">{t("status.preapproved")}</MenuItem>
            <MenuItem value="approved">{t("status.approved")}</MenuItem>
            <MenuItem value="rejected">{t("status.rejected")}</MenuItem>
            <MenuItem value="cancelled">{t("status.cancelled")}</MenuItem>
            <MenuItem value="completed">{t("status.completed")}</MenuItem>
          </Select>
        </FormControl>

        <FormControl size="small" className="w-full md:min-w-[180px]">
          <InputLabel id="adoptions-priority-filter-label">{t("filters.priority.label")}</InputLabel>
          <Select
            labelId="adoptions-priority-filter-label"
            value={priority}
            label={t("filters.priority.label")}
            onChange={handleSelect(onPriorityChange)}
          >
            <MenuItem value="all">{t("filters.priority.all")}</MenuItem>
            <MenuItem value="high">{t("priority.high")}</MenuItem>
            <MenuItem value="medium">{t("priority.medium")}</MenuItem>
            <MenuItem value="low">{t("priority.low")}</MenuItem>
          </Select>
        </FormControl>
      </Box>
    </Box>
  );
}
