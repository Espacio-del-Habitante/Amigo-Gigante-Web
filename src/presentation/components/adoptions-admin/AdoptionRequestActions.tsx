"use client";

import { Box, Button, CircularProgress } from "@mui/material";
import { useTranslations } from "next-intl";

export interface AdoptionRequestActionsProps {
  canApprove: boolean;
  canReject: boolean;
  canRequestInfo: boolean;
  isUpdating: boolean;
  onApprove: () => void;
  onReject: () => void;
  onRequestInfo: () => void;
}

export function AdoptionRequestActions({
  canApprove,
  canReject,
  canRequestInfo,
  isUpdating,
  onApprove,
  onReject,
  onRequestInfo,
}: AdoptionRequestActionsProps) {
  const t = useTranslations("adoptionsAdmin");

  return (
    <Box className="sticky bottom-0 z-10 -mx-4 border-t border-neutral-100 bg-white/90 px-4 py-4 backdrop-blur md:-mx-8 md:px-8">
      <Box className="flex flex-wrap items-center justify-end gap-3">
        <Button
          variant="outlined"
          disabled={!canRequestInfo || isUpdating}
          onClick={onRequestInfo}
          className="min-w-[180px]"
        >
          {t("actions.requestInfo")}
        </Button>
        <Button
          variant="outlined"
          color="error"
          disabled={!canReject || isUpdating}
          onClick={onReject}
          className="min-w-[140px]"
        >
          {t("actions.reject")}
        </Button>
        <Button
          variant="contained"
          color="primary"
          disabled={!canApprove || isUpdating}
          onClick={onApprove}
          startIcon={isUpdating ? <CircularProgress size={18} color="inherit" /> : undefined}
          className="min-w-[190px]"
          sx={{ fontWeight: 800 }}
        >
          {t("actions.approve")}
        </Button>
      </Box>
    </Box>
  );
}
