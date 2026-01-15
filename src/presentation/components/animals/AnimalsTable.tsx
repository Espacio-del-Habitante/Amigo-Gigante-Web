"use client";

import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import { Avatar, Box, Button, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";

import type { AnimalManagement } from "@/domain/models/AnimalManagement";
import { AnimalStatusBadge } from "@/presentation/components/animals/AnimalStatusBadge";

function formatAnimalId(id: number) {
  return `#AG-${String(id).padStart(4, "0")}`;
}

function formatAdmissionDate(dateIso: string, locale: string) {
  const date = new Date(dateIso);

  return new Intl.DateTimeFormat(locale, {
    month: "short",
    day: "2-digit",
    year: "numeric",
  }).format(date);
}

export interface AnimalsTableProps {
  animals: AnimalManagement[];
  onDelete?: (animal: AnimalManagement) => void;
}

export function AnimalsTable({ animals, onDelete }: AnimalsTableProps) {
  const t = useTranslations("animals");
  const locale = useLocale();
  const router = useRouter();

  return (
    <Box className="overflow-x-auto rounded-2xl border border-neutral-100 bg-white">
      <Table sx={{ minWidth: 940 }}>
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: 800 }}>{t("table.columns.profile")}</TableCell>
            <TableCell sx={{ fontWeight: 800 }}>{t("table.columns.nameId")}</TableCell>
            <TableCell sx={{ fontWeight: 800 }}>{t("table.columns.species")}</TableCell>
            <TableCell sx={{ fontWeight: 800 }}>{t("table.columns.admissionDate")}</TableCell>
            <TableCell sx={{ fontWeight: 800 }}>{t("table.columns.status")}</TableCell>
            <TableCell sx={{ fontWeight: 800, textAlign: "right" }}>{t("table.columns.actions")}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {animals.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6}>
                <Typography variant="body2" color="text.secondary">
                  {t("search.noResults")}
                </Typography>
              </TableCell>
            </TableRow>
          ) : (
            animals.map((animal) => {
              const animalId = formatAnimalId(animal.id);
              const translatedSpecies = t(`filters.species.${animal.species}`);

              return (
                <TableRow
                  key={animal.id}
                  className="group"
                  hover
                  sx={{
                    "&:hover": { backgroundColor: "rgba(148, 163, 184, 0.08)" },
                  }}
                >
                  <TableCell>
                    <Avatar
                      src={animal.coverImageUrl ?? undefined}
                      alt={animal.name}
                      sx={{ width: 44, height: 44 }}
                    >
                      {animal.name.slice(0, 1).toUpperCase()}
                    </Avatar>
                  </TableCell>

                  <TableCell>
                    <Box className="flex flex-col">
                      <Typography variant="body2" sx={{ fontWeight: 800 }}>
                        {animal.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {animalId}
                      </Typography>
                    </Box>
                  </TableCell>

                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {translatedSpecies} ({animal.breed})
                    </Typography>
                  </TableCell>

                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {formatAdmissionDate(animal.createdAt, locale)}
                    </Typography>
                  </TableCell>

                  <TableCell>
                    <AnimalStatusBadge status={animal.status} />
                  </TableCell>

                  <TableCell sx={{ textAlign: "right" }}>
                    <Box className="inline-flex items-center justify-end gap-2 opacity-0 transition-opacity duration-150 group-hover:opacity-100 group-focus-within:opacity-100">
                      <Button
                        size="small"
                        startIcon={<EditRoundedIcon fontSize="small" />}
                        variant="text"
                        aria-label={t("table.actions.edit")}
                        onClick={() => {
                          router.push(`/${locale}/foundations/animals/${animal.id}/edit`);
                        }}
                      >
                        {t("table.actions.edit")}
                      </Button>
                      <Button
                        size="small"
                        startIcon={<DeleteOutlineRoundedIcon fontSize="small" />}
                        variant="text"
                        color="error"
                        aria-label={t("table.actions.delete")}
                        disabled={!onDelete}
                        onClick={() => onDelete?.(animal)}
                      >
                        {t("table.actions.delete")}
                      </Button>
                    </Box>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </Box>
  );
}

