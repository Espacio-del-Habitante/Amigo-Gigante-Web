"use client";

import NavigateNextRoundedIcon from "@mui/icons-material/NavigateNextRounded";
import {
  Alert,
  Box,
  Breadcrumbs,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
} from "@mui/material";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import type { AdoptionRequestDetail, AdoptionRequestStatus } from "@/domain/models/AdoptionRequest";
import { GetAdoptionRequestDetailUseCase } from "@/domain/usecases/adopt/GetAdoptionRequestDetailUseCase";
import { UpdateAdoptionRequestStatusUseCase } from "@/domain/usecases/adopt/UpdateAdoptionRequestStatusUseCase";
import { appContainer } from "@/infrastructure/ioc/container";
import { USE_CASE_TYPES } from "@/infrastructure/ioc/usecases/usecases.types";
import { AdoptionRequestActions } from "@/presentation/components/adoptions-admin/AdoptionRequestActions";
import { AdoptionRequestDocuments } from "@/presentation/components/adoptions-admin/AdoptionRequestDocuments";
import { AdoptionRequestPriorityBadge } from "@/presentation/components/adoptions-admin/AdoptionRequestPriorityBadge";
import { AdoptionRequestProfile } from "@/presentation/components/adoptions-admin/AdoptionRequestProfile";
import { AdoptionRequestStatusBadge } from "@/presentation/components/adoptions-admin/AdoptionRequestStatusBadge";

type AdoptionRequestErrorKey =
  | "errors.unauthorized"
  | "errors.connection"
  | "errors.notFound"
  | "errors.generic";

const finalStatuses: AdoptionRequestStatus[] = ["approved", "rejected", "cancelled", "completed"];

export function AdoptionRequestDetailPage() {
  const t = useTranslations("adoptionsAdmin");
  const locale = useLocale();
  const params = useParams();
  const rawId = params?.id;
  const requestId = Array.isArray(rawId) ? Number(rawId[0]) : Number(rawId);
  const isValidId = Number.isFinite(requestId);

  const getRequestDetailUseCase = useMemo(
    () => appContainer.get<GetAdoptionRequestDetailUseCase>(USE_CASE_TYPES.GetAdoptionRequestDetailUseCase),
    [],
  );
  const updateStatusUseCase = useMemo(
    () => appContainer.get<UpdateAdoptionRequestStatusUseCase>(USE_CASE_TYPES.UpdateAdoptionRequestStatusUseCase),
    [],
  );
  const requestCounterRef = useRef(0);

  const [detail, setDetail] = useState<AdoptionRequestDetail | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorKey, setErrorKey] = useState<AdoptionRequestErrorKey | null>(null);
  const [updateErrorKey, setUpdateErrorKey] = useState<AdoptionRequestErrorKey | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [rejectTouched, setRejectTouched] = useState(false);

  const resolveErrorKey = useCallback((error: unknown): AdoptionRequestErrorKey => {
    if (error instanceof Error) {
      const key = error.message as AdoptionRequestErrorKey;
      if (
        key === "errors.unauthorized" ||
        key === "errors.connection" ||
        key === "errors.notFound" ||
        key === "errors.generic"
      ) {
        return key;
      }
    }
    return "errors.generic";
  }, []);

  const loadDetail = useCallback(async () => {
    const requestSequence = ++requestCounterRef.current;
    setIsLoading(true);
    setErrorKey(null);

    if (!isValidId) {
      setDetail(null);
      setErrorKey("errors.notFound");
      setIsLoading(false);
      return;
    }

    try {
      const result = await getRequestDetailUseCase.execute({ requestId });

      if (requestSequence !== requestCounterRef.current) return;

      setDetail(result);
    } catch (error) {
      if (requestSequence !== requestCounterRef.current) return;
      setDetail(null);
      setErrorKey(resolveErrorKey(error));
    } finally {
      if (requestSequence === requestCounterRef.current) {
        setIsLoading(false);
      }
    }
  }, [getRequestDetailUseCase, isValidId, requestId, resolveErrorKey]);

  useEffect(() => {
    void loadDetail();
  }, [loadDetail]);

  const formatDateLabel = useCallback(
    (dateIso: string) =>
      new Intl.DateTimeFormat(locale, {
        month: "short",
        day: "2-digit",
        year: "numeric",
      }).format(new Date(dateIso)),
    [locale],
  );

  const formatAgeLabel = useCallback(
    (ageMonths: number | null) => {
      if (ageMonths === null) return t("detail.animal.ageUnknown");
      if (ageMonths < 12) return t("detail.animal.ageMonths", { count: ageMonths });
      const years = Math.floor(ageMonths / 12);
      return t("detail.animal.ageYears", { count: Math.max(1, years) });
    },
    [t],
  );

  const formatSexLabel = useCallback(
    (sex: AdoptionRequestDetail["animal"]["sex"]) => {
      if (sex === "male") return t("detail.animal.sex.male");
      if (sex === "female") return t("detail.animal.sex.female");
      return t("detail.animal.sex.unknown");
    },
    [t],
  );

  const formatSizeLabel = useCallback(
    (size: AdoptionRequestDetail["animal"]["size"]) => {
      if (size === "small") return t("detail.animal.size.small");
      if (size === "medium") return t("detail.animal.size.medium");
      if (size === "large") return t("detail.animal.size.large");
      return t("detail.animal.size.unknown");
    },
    [t],
  );

  const formatSpeciesLabel = useCallback(
    (species: AdoptionRequestDetail["animal"]["species"]) => {
      if (species === "dog") return t("detail.animal.species.dog");
      if (species === "cat") return t("detail.animal.species.cat");
      if (species === "bird") return t("detail.animal.species.bird");
      return t("detail.animal.species.other");
    },
    [t],
  );

  const handleStatusUpdate = useCallback(
    async (nextStatus: AdoptionRequestStatus, reason?: string | null) => {
      if (!detail) return;
      setIsUpdating(true);
      setUpdateErrorKey(null);

      try {
        await updateStatusUseCase.execute({
          requestId: detail.id,
          status: nextStatus,
          rejectionReason: reason ?? null,
        });

        setDetail((prev) =>
          prev
            ? {
                ...prev,
                status: nextStatus,
                rejectionReason: nextStatus === "rejected" ? reason ?? null : null,
              }
            : prev,
        );
      } catch (error) {
        setUpdateErrorKey(resolveErrorKey(error));
      } finally {
        setIsUpdating(false);
      }
    },
    [detail, resolveErrorKey, updateStatusUseCase],
  );

  const openRejectDialog = () => {
    setRejectionReason(detail?.rejectionReason ?? "");
    setRejectTouched(false);
    setIsRejectDialogOpen(true);
  };

  const closeRejectDialog = () => {
    if (isUpdating) return;
    setIsRejectDialogOpen(false);
    setRejectTouched(false);
  };

  const confirmReject = async () => {
    const trimmedReason = rejectionReason.trim();
    setRejectTouched(true);
    if (!trimmedReason) return;
    await handleStatusUpdate("rejected", trimmedReason);
    setIsRejectDialogOpen(false);
  };

  const status = detail?.status;
  const isFinal = status ? finalStatuses.includes(status) : true;
  const canApprove = status === "pending" || status === "in_review";
  const canRequestInfo = Boolean(status && !isFinal && status !== "info_requested");
  const canReject = Boolean(status && !isFinal);
  const rejectionReasonInvalid = rejectTouched && rejectionReason.trim().length === 0;

  return (
    <Box className="flex w-full flex-col gap-6">
      <Breadcrumbs separator={<NavigateNextRoundedIcon fontSize="small" />} aria-label={t("detail.breadcrumb.ariaLabel")}>
        <Link href={`/${locale}/admin/adoptions`} className="text-sm font-semibold text-neutral-600 hover:text-neutral-900">
          {t("detail.breadcrumb.list")}
        </Link>
        <Typography variant="body2" className="font-semibold text-neutral-900">
          {t("detail.breadcrumb.detail")}
        </Typography>
      </Breadcrumbs>

      {isLoading ? (
        <Box className="flex flex-col items-center justify-center gap-3 py-16">
          <CircularProgress aria-label={t("states.loadingDetail")} />
          <Typography variant="body2" color="text.secondary">
            {t("states.loadingDetail")}
          </Typography>
        </Box>
      ) : errorKey ? (
        <Alert severity="error">{t(errorKey)}</Alert>
      ) : detail ? (
        <>
          <Box className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <Box className="flex flex-col gap-2">
              <Typography variant="h4" sx={{ fontWeight: 900 }}>
                {t("detail.header.title", { animal: detail.animal.name || t("labels.notAvailable") })}
              </Typography>
              <Box className="flex flex-wrap items-center gap-2">
                <AdoptionRequestStatusBadge status={detail.status} />
                <AdoptionRequestPriorityBadge priority={detail.priority} />
                <Typography variant="body2" color="text.secondary">
                  {t("detail.header.submittedAt", { date: formatDateLabel(detail.createdAt) })}
                </Typography>
              </Box>
            </Box>
            <Typography variant="body2" color="text.secondary">
              {t("detail.header.requestId", { id: detail.id })}
            </Typography>
          </Box>

          {detail.rejectionReason && detail.status === "rejected" ? (
            <Alert severity="warning">
              {t("detail.rejectionReason", { reason: detail.rejectionReason })}
            </Alert>
          ) : null}

          {updateErrorKey ? <Alert severity="error">{t(updateErrorKey)}</Alert> : null}

          <Box className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <Box className="space-y-6 lg:col-span-2">
              <AdoptionRequestProfile profile={detail.adopterProfile} />
              <AdoptionRequestDocuments documents={detail.documents} />
            </Box>

            <Box className="space-y-6">
              <Box className="overflow-hidden rounded-2xl border border-neutral-100 bg-white shadow-soft">
                <Box
                  className="aspect-[4/3] w-full bg-neutral-100 bg-cover bg-center"
                  sx={{
                    backgroundImage: detail.animal.coverImageUrl
                      ? `url(${detail.animal.coverImageUrl})`
                      : "none",
                  }}
                />
                <Box className="p-6">
                  <Box className="flex items-center justify-between">
                    <Typography variant="h6" sx={{ fontWeight: 900 }}>
                      {detail.animal.name || t("labels.notAvailable")}
                    </Typography>
                    <Typography variant="caption" className="rounded-full bg-brand-50 px-2 py-1 font-bold text-brand-700">
                      {formatSpeciesLabel(detail.animal.species)}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary" className="mt-2">
                    {[
                      detail.animal.breed || t("detail.animal.breedUnknown"),
                      formatSexLabel(detail.animal.sex),
                      formatAgeLabel(detail.animal.ageMonths),
                      formatSizeLabel(detail.animal.size),
                    ].join(" • ")}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>

          <AdoptionRequestActions
            canApprove={canApprove}
            canReject={canReject}
            canRequestInfo={canRequestInfo}
            isUpdating={isUpdating}
            onApprove={() => handleStatusUpdate("approved")}
            onReject={openRejectDialog}
            onRequestInfo={() => handleStatusUpdate("info_requested")}
          />
        </>
      ) : null}

      <Dialog open={isRejectDialogOpen} onClose={closeRejectDialog} fullWidth maxWidth="sm">
        <DialogTitle>{t("detail.rejectDialog.title")}</DialogTitle>
        <DialogContent className="space-y-4">
          <Typography variant="body2" color="text.secondary">
            {t("detail.rejectDialog.description")}
          </Typography>
          <TextField
            multiline
            minRows={3}
            value={rejectionReason}
            onChange={(event) => setRejectionReason(event.target.value)}
            onBlur={() => setRejectTouched(true)}
            placeholder={t("detail.rejectDialog.placeholder")}
            error={rejectionReasonInvalid}
            helperText={rejectionReasonInvalid ? t("detail.rejectDialog.required") : " "}
            fullWidth
          />
        </DialogContent>
        <DialogActions className="px-6 pb-4">
          <Button variant="outlined" onClick={closeRejectDialog} disabled={isUpdating}>
            {t("detail.rejectDialog.cancel")}
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={confirmReject}
            disabled={isUpdating || rejectionReason.trim().length === 0}
          >
            {t("detail.rejectDialog.confirm")}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
