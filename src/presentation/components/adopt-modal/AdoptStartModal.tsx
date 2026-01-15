"use client";

import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import VolunteerActivismRoundedIcon from "@mui/icons-material/VolunteerActivismRounded";
import {
  Alert,
  Box,
  Dialog,
  DialogContent,
  Divider,
  IconButton,
  Typography,
} from "@mui/material";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

import { Button } from "@/presentation/components/atoms";

import { AdoptContactPanel } from "./AdoptContactPanel";
import { AdoptFormWizard } from "./AdoptFormWizard";

type AdoptModalFlow = "start" | "contact" | "form";

interface AdoptStartModalProps {
  open: boolean;
  onClose: () => void;
  animal: { id: number; name: string; foundationId: string } | null;
}

export function AdoptStartModal({ open, onClose, animal }: AdoptStartModalProps) {
  const t = useTranslations("adoptRequest");
  const [flow, setFlow] = useState<AdoptModalFlow>("start");

  useEffect(() => {
    if (!open) {
      setFlow("start");
    }
  }, [open]);

  const handleClose = () => {
    onClose();
  };

  const maxWidth = flow === "form" ? "md" : "sm";

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth={maxWidth}
      fullWidth
      BackdropProps={{ className: "bg-neutral-900/60 backdrop-blur-sm" }}
      PaperProps={{ className: "overflow-hidden rounded-2xl border border-neutral-100 shadow-strong" }}
    >
      <DialogContent className="relative p-0">
        <IconButton
          aria-label={t("actions.close")}
          onClick={handleClose}
          className="absolute right-4 top-4 z-10"
        >
          <CloseRoundedIcon />
        </IconButton>

        <Box className="p-6 md:p-8">
          {flow === "start" ? (
            <Box className="space-y-6 text-center">
              <Box className="flex justify-center">
                <Box className="flex h-28 w-28 items-center justify-center rounded-full bg-brand-50">
                  <img src="/file.svg" alt={t("modal.heroAlt")} className="h-20 w-20" />
                </Box>
              </Box>

              <Box className="space-y-2">
                <Typography variant="h5" sx={{ fontWeight: 900 }}>
                  {t("modal.title")}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {t("modal.subtitle")}
                </Typography>
              </Box>

              {!animal ? <Alert severity="error">{t("errors.generic")}</Alert> : null}

              <Box className="space-y-4">
                <Button
                  fullWidth
                  tone="primary"
                  startIcon={<VolunteerActivismRoundedIcon fontSize="small" />}
                  onClick={() => setFlow("contact")}
                  disabled={!animal}
                >
                  {t("modal.actions.contact")}
                </Button>

                <Box className="flex items-center gap-3">
                  <Divider className="flex-1" />
                  <Typography variant="caption" color="text.secondary" className="uppercase tracking-wide">
                    {t("modal.actions.or")}
                  </Typography>
                  <Divider className="flex-1" />
                </Box>

                <Button
                  fullWidth
                  tone="secondary"
                  variant="outlined"
                  startIcon={<EditRoundedIcon fontSize="small" />}
                  onClick={() => setFlow("form")}
                  disabled={!animal}
                >
                  {t("modal.actions.form")}
                </Button>
              </Box>

              <Typography variant="caption" color="text.secondary">
                {t("modal.terms")}
              </Typography>
            </Box>
          ) : null}

          {flow === "contact" && animal ? <AdoptContactPanel foundationId={animal.foundationId} /> : null}

          {flow === "form" && animal ? (
            <AdoptFormWizard
              animalId={animal.id}
              foundationId={animal.foundationId}
              animalName={animal.name}
              onClose={handleClose}
            />
          ) : null}
        </Box>
      </DialogContent>
    </Dialog>
  );
}
