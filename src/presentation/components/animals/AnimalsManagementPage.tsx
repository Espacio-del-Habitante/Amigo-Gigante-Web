"use client";

import AddRoundedIcon from "@mui/icons-material/AddRounded";
import { Alert, Box, Button, CircularProgress, Typography } from "@mui/material";
import { useLocale, useTranslations } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import type { AnimalManagement } from "@/domain/models/AnimalManagement";
import type { GetAnimalsFilters } from "@/domain/repositories/IAnimalRepository";
import { DeleteAnimalUseCase } from "@/domain/usecases/animals/DeleteAnimalUseCase";
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
import { ConfirmDeleteModal } from "@/presentation/components/common/ConfirmDeleteModal";

const animalsErrorKeyList = ["errors.unauthorized", "errors.connection", "errors.generic"] as const;
type AnimalsErrorKey = (typeof animalsErrorKeyList)[number];

export function AnimalsManagementPage() {
  const t = useTranslations("animals");
  const tCommon = useTranslations("common");
  const locale = useLocale();
  const router = useRouter();
  const searchParams = useSearchParams();
  const getAnimalsUseCase = useMemo(
    () => appContainer.get<GetAnimalsUseCase>(USE_CASE_TYPES.GetAnimalsUseCase),
    [],
  );
  const deleteAnimalUseCase = useMemo(
    () => appContainer.get<DeleteAnimalUseCase>(USE_CASE_TYPES.DeleteAnimalUseCase),
    [],
  );
  const animalsErrorKeys = useMemo(() => new Set<AnimalsErrorKey>(animalsErrorKeyList), []);
  const requestCounterRef = useRef(0);

  const [searchValue, setSearchValue] = useState("");
  const [status, setStatus] = useState<AnimalsStatusFilter>("all");
  const [species, setSpecies] = useState<AnimalsSpeciesFilter>("all");
  const [sort, setSort] = useState<AnimalsSortOption>("newest");
  const [page, setPage] = useState(1);
  const [animals, setAnimals] = useState<AnimalManagement[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [errorKey, setErrorKey] = useState<AnimalsErrorKey | null>(null);
  const [showCreateSuccess, setShowCreateSuccess] = useState(true);
  const [selectedAnimal, setSelectedAnimal] = useState<AnimalManagement | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteErrorKey, setDeleteErrorKey] = useState<AnimalsErrorKey | null>(null);

  const pageSize = 5;
  const createdParam = searchParams.get("created");
  const createSuccessMessageKey =
    createdParam === "published"
      ? "add.success.published"
      : createdParam === "draft"
        ? "add.success.draft"
        : null;

  const resolveErrorMessage = useCallback(
    (error: unknown): AnimalsErrorKey => {
      if (error instanceof Error) {
        const candidate = error.message as AnimalsErrorKey;
        if (animalsErrorKeys.has(candidate)) {
          return candidate;
        }
      }

      return "errors.generic";
    },
    [animalsErrorKeys],
  );

  const buildFilters = useCallback(
    (input: { searchValue: string; status: AnimalsStatusFilter; species: AnimalsSpeciesFilter; sort: AnimalsSortOption }): GetAnimalsFilters => {
      const filters: GetAnimalsFilters = { sort: input.sort };

      if (input.status !== "all") {
        filters.status = input.status;
      }

      if (input.species !== "all") {
        filters.species = input.species;
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
    () => buildFilters({ searchValue, status, species, sort }),
    [buildFilters, searchValue, species, sort, status],
  );

  const loadAnimals = useCallback(
    async (input: { page: number; filters: GetAnimalsFilters }) => {
      const requestId = ++requestCounterRef.current;
      setIsLoading(true);
      setErrorKey(null);

      try {
        const result = await getAnimalsUseCase.execute({
          filters: input.filters,
          pagination: { page: input.page, pageSize },
        });

        if (requestId !== requestCounterRef.current) return;

        setAnimals(result.animals);
        setTotal(result.total);
      } catch (error) {
        if (requestId !== requestCounterRef.current) return;

        setAnimals([]);
        setTotal(0);
        setErrorKey(resolveErrorMessage(error));
      } finally {
        if (requestId === requestCounterRef.current) {
          setIsLoading(false);
        }
      }
    },
    [getAnimalsUseCase, pageSize, resolveErrorMessage],
  );

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

  const handleDeleteRequest = (animal: AnimalManagement) => {
    setSelectedAnimal(animal);
    setDeleteErrorKey(null);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteClose = useCallback(() => {
    if (isDeleting) return;
    setIsDeleteModalOpen(false);
    setSelectedAnimal(null);
    setDeleteErrorKey(null);
  }, [isDeleting]);

  const handleDeleteConfirm = useCallback(async () => {
    if (!selectedAnimal) return;
    setIsDeleting(true);
    setDeleteErrorKey(null);

    try {
      await deleteAnimalUseCase.execute({ animalId: selectedAnimal.id });
      setIsDeleteModalOpen(false);
      setSelectedAnimal(null);
      await loadAnimals({ page, filters: effectiveFilters });
    } catch (error) {
      setDeleteErrorKey(resolveErrorMessage(error));
    } finally {
      setIsDeleting(false);
    }
  }, [deleteAnimalUseCase, effectiveFilters, loadAnimals, page, resolveErrorMessage, selectedAnimal]);

  const deleteItemLabel = tCommon("deleteModal.entity.animal");
  const deleteModalTitle = tCommon("deleteModal.title", { item: deleteItemLabel });
  const deleteModalDescription = tCommon("deleteModal.description", { item: deleteItemLabel });
  const deleteErrorMessage = deleteErrorKey
    ? tCommon(`deleteModal.errors.${deleteErrorKey.replace("errors.", "")}`, { item: deleteItemLabel })
    : null;

  useEffect(() => {
    void loadAnimals({ page, filters: effectiveFilters });
  }, [effectiveFilters, loadAnimals, page]);

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
          onClick={() => {
            router.push(`/${locale}/foundations/animals/add`);
          }}
        >
          {t("addButton")}
        </Button>
      </Box>

      {createSuccessMessageKey && showCreateSuccess ? (
        <Alert severity="success" onClose={() => setShowCreateSuccess(false)}>
          {t(createSuccessMessageKey)}
        </Alert>
      ) : null}

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
        <AnimalsTable animals={animals} onDelete={handleDeleteRequest} />
      )}

      <ConfirmDeleteModal
        open={isDeleteModalOpen}
        title={deleteModalTitle}
        description={deleteModalDescription}
        confirmLabel={tCommon("deleteModal.confirm")}
        cancelLabel={tCommon("deleteModal.cancel")}
        loadingLabel={tCommon("deleteModal.loading")}
        isLoading={isDeleting}
        errorMessage={deleteErrorMessage}
        onConfirm={handleDeleteConfirm}
        onClose={handleDeleteClose}
      />

      <AnimalsPagination
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

