"use client";

import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";
import { Alert, Box, Button, CircularProgress, Typography } from "@mui/material";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import type { AdoptionRequestPriority, AdoptionRequestStatus, AdoptionRequestSummary } from "@/domain/models/AdoptionRequest";
import type { GetAdoptionRequestsFilters } from "@/domain/repositories/IAdoptionRequestRepository";
import { GetAdminAdoptionRequestsUseCase } from "@/domain/usecases/adopt/GetAdminAdoptionRequestsUseCase";
import { appContainer } from "@/infrastructure/ioc/container";
import { USE_CASE_TYPES } from "@/infrastructure/ioc/usecases/usecases.types";
import {
  AdoptionRequestsFilters,
  type AdoptionRequestPriorityFilter,
  type AdoptionRequestStatusFilter,
} from "@/presentation/components/adoptions-admin/AdoptionRequestsFilters";
import { AdoptionRequestsPagination } from "@/presentation/components/adoptions-admin/AdoptionRequestsPagination";
import { AdoptionRequestsTable } from "@/presentation/components/adoptions-admin/AdoptionRequestsTable";

const adoptionRequestsErrorKeyList = ["errors.unauthorized", "errors.connection", "errors.generic"] as const;
type AdoptionRequestsErrorKey = (typeof adoptionRequestsErrorKeyList)[number];

const escapeCsvValue = (value: string) => {
  const escaped = value.replace(/"/g, '""');
  if (/[",\n]/.test(escaped)) {
    return `"${escaped}"`;
  }
  return escaped;
};

const buildCsvRow = (values: string[]) => values.map(escapeCsvValue).join(",");

export function AdoptionRequestsPage() {
  const t = useTranslations("adoptionsAdmin");
  const locale = useLocale();
  const router = useRouter();
  const getAdminRequestsUseCase = useMemo(
    () => appContainer.get<GetAdminAdoptionRequestsUseCase>(USE_CASE_TYPES.GetAdminAdoptionRequestsUseCase),
    [],
  );
  const requestCounterRef = useRef(0);
  const errorKeys = useMemo(() => new Set<AdoptionRequestsErrorKey>(adoptionRequestsErrorKeyList), []);

  const [searchValue, setSearchValue] = useState("");
  const [status, setStatus] = useState<AdoptionRequestStatusFilter>("all");
  const [priority, setPriority] = useState<AdoptionRequestPriorityFilter>("all");
  const [page, setPage] = useState(1);
  const [requests, setRequests] = useState<AdoptionRequestSummary[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [errorKey, setErrorKey] = useState<AdoptionRequestsErrorKey | null>(null);

  const pageSize = 4;

  const resolveErrorMessage = useCallback(
    (error: unknown): AdoptionRequestsErrorKey => {
      if (error instanceof Error) {
        const candidate = error.message as AdoptionRequestsErrorKey;
        if (errorKeys.has(candidate)) {
          return candidate;
        }
      }
      return "errors.generic";
    },
    [errorKeys],
  );

  const buildFilters = useCallback(
    (input: {
      searchValue: string;
      status: AdoptionRequestStatusFilter;
      priority: AdoptionRequestPriorityFilter;
    }): GetAdoptionRequestsFilters => {
      const filters: GetAdoptionRequestsFilters = {};

      if (input.status !== "all") {
        filters.status = input.status as AdoptionRequestStatus;
      }

      if (input.priority !== "all") {
        filters.priority = input.priority as AdoptionRequestPriority;
      }

      const search = input.searchValue.trim();
      if (search.length > 0) {
        filters.search = search;
      }

      return filters;
    },
    [],
  );

  const effectiveFilters = useMemo(
    () => buildFilters({ searchValue, status, priority }),
    [buildFilters, priority, searchValue, status],
  );

  const loadRequests = useCallback(
    async (input: { page: number; filters: GetAdoptionRequestsFilters }) => {
      const requestId = ++requestCounterRef.current;
      setIsLoading(true);
      setErrorKey(null);

      try {
        const result = await getAdminRequestsUseCase.execute({
          filters: input.filters,
          pagination: { page: input.page, pageSize },
        });

        if (requestId !== requestCounterRef.current) return;

        setRequests(result.requests);
        setTotal(result.total);
      } catch (error) {
        if (requestId !== requestCounterRef.current) return;

        setRequests([]);
        setTotal(0);
        setErrorKey(resolveErrorMessage(error));
      } finally {
        if (requestId === requestCounterRef.current) {
          setIsLoading(false);
        }
      }
    },
    [getAdminRequestsUseCase, pageSize, resolveErrorMessage],
  );

  useEffect(() => {
    void loadRequests({ page, filters: effectiveFilters });
  }, [effectiveFilters, loadRequests, page]);

  const handleSearchChange = (value: string) => {
    setSearchValue(value);
    setPage(1);
  };

  const handleStatusChange = (value: AdoptionRequestStatusFilter) => {
    setStatus(value);
    setPage(1);
  };

  const handlePriorityChange = (value: AdoptionRequestPriorityFilter) => {
    setPriority(value);
    setPage(1);
  };

  const handleExportCsv = () => {
    if (requests.length === 0) return;

    const headers = [
      t("table.columns.animal"),
      t("table.columns.adopter"),
      t("table.columns.priority"),
      t("table.columns.status"),
      t("table.columns.date"),
    ];

    const rows = requests.map((request) => {
      const dateLabel = new Intl.DateTimeFormat(locale, {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }).format(new Date(request.createdAt));

      return buildCsvRow([
        request.animal.name || t("labels.notAvailable"),
        request.adopter.displayName || t("labels.notAvailable"),
        t(`priority.${request.priority}`),
        t(`status.${request.status}`),
        dateLabel,
      ]);
    });

    const csvContent = [buildCsvRow(headers), ...rows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    const timestamp = new Date().toISOString().split("T")[0];

    link.href = url;
    link.download = `adoption-requests-${timestamp}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

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
          variant="outlined"
          startIcon={<DownloadRoundedIcon />}
          className="w-full md:w-auto"
          aria-label={t("actions.exportCsv")}
          onClick={handleExportCsv}
          disabled={requests.length === 0}
        >
          {t("actions.exportCsv")}
        </Button>
      </Box>

      <AdoptionRequestsFilters
        searchValue={searchValue}
        onSearchChange={handleSearchChange}
        status={status}
        onStatusChange={handleStatusChange}
        priority={priority}
        onPriorityChange={handlePriorityChange}
      />

      {errorKey ? (
        <Alert severity="error">{t(errorKey)}</Alert>
      ) : null}

      {isLoading ? (
        <Box className="flex justify-center py-10">
          <CircularProgress aria-label={t("states.loadingList")} />
        </Box>
      ) : (
        <AdoptionRequestsTable
          requests={requests}
          onViewDetail={(requestId) => {
            router.push(`/${locale}/foundations/adoptions/${requestId}`);
          }}
        />
      )}

      <AdoptionRequestsPagination
        total={total}
        page={page}
        pageSize={pageSize}
        onPageChange={(nextPage) => {
          setPage(nextPage);
        }}
      />
    </Box>
  );
}
