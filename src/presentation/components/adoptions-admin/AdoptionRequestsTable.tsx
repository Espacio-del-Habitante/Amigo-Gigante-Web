"use client";

import { Avatar, Box, Button, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material";
import { useLocale, useTranslations } from "next-intl";

import type { AdoptionRequestSummary } from "@/domain/models/AdoptionRequest";
import { AdoptionRequestPriorityBadge } from "@/presentation/components/adoptions-admin/AdoptionRequestPriorityBadge";
import { AdoptionRequestStatusBadge } from "@/presentation/components/adoptions-admin/AdoptionRequestStatusBadge";

export interface AdoptionRequestsTableProps {
  requests: AdoptionRequestSummary[];
  onViewDetail?: (requestId: number) => void;
}

function formatRequestId(id: number) {
  return `#AR-${String(id).padStart(4, "0")}`;
}

function formatDateLabel(dateIso: string, locale: string) {
  return new Intl.DateTimeFormat(locale, {
    month: "short",
    day: "2-digit",
    year: "numeric",
  }).format(new Date(dateIso));
}

export function AdoptionRequestsTable({ requests, onViewDetail }: AdoptionRequestsTableProps) {
  const t = useTranslations("adoptionsAdmin");
  const locale = useLocale();

  return (
    <Box className="overflow-x-auto rounded-2xl border border-neutral-100 bg-white">
      <Table sx={{ minWidth: 900 }}>
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: 800 }}>{t("table.columns.animal")}</TableCell>
            <TableCell sx={{ fontWeight: 800 }}>{t("table.columns.adopter")}</TableCell>
            <TableCell sx={{ fontWeight: 800 }}>{t("table.columns.priority")}</TableCell>
            <TableCell sx={{ fontWeight: 800 }}>{t("table.columns.status")}</TableCell>
            <TableCell sx={{ fontWeight: 800 }}>{t("table.columns.date")}</TableCell>
            <TableCell sx={{ fontWeight: 800, textAlign: "right" }}>{t("table.columns.actions")}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {requests.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6}>
                <Typography variant="body2" color="text.secondary">
                  {t("table.empty")}
                </Typography>
              </TableCell>
            </TableRow>
          ) : (
            requests.map((request) => (
              <TableRow
                key={request.id}
                className="group"
                hover
                sx={{
                  "&:hover": { backgroundColor: "rgba(148, 163, 184, 0.08)" },
                }}
              >
                <TableCell>
                  <Box className="flex items-center gap-3">
                    <Avatar
                      src={request.animal.coverImageUrl ?? undefined}
                      alt={request.animal.name}
                      sx={{ width: 44, height: 44 }}
                    >
                      {request.animal.name.slice(0, 1).toUpperCase()}
                    </Avatar>
                    <Box className="flex flex-col">
                      <Typography variant="body2" sx={{ fontWeight: 800 }}>
                        {request.animal.name || t("labels.notAvailable")}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {formatRequestId(request.id)}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" color="text.secondary">
                    {request.adopter.displayName || t("labels.notAvailable")}
                  </Typography>
                </TableCell>
                <TableCell>
                  <AdoptionRequestPriorityBadge priority={request.priority} />
                </TableCell>
                <TableCell>
                  <AdoptionRequestStatusBadge status={request.status} />
                </TableCell>
                <TableCell>
                  <Typography variant="body2" color="text.secondary">
                    {formatDateLabel(request.createdAt, locale)}
                  </Typography>
                </TableCell>
                <TableCell sx={{ textAlign: "right" }}>
                  <Button
                    size="small"
                    variant="text"
                    className="bg-brand-50 text-brand-700 hover:bg-brand-100"
                    onClick={() => onViewDetail?.(request.id)}
                  >
                    {t("actions.viewDetail")}
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </Box>
  );
}
