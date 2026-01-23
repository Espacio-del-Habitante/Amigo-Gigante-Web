"use client";

import AlternateEmailRoundedIcon from "@mui/icons-material/AlternateEmailRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import MailRoundedIcon from "@mui/icons-material/MailRounded";
import ReceiptLongRoundedIcon from "@mui/icons-material/ReceiptLongRounded";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import VideocamRoundedIcon from "@mui/icons-material/VideocamRounded";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import { useTranslations } from "next-intl";
import type { ReactElement } from "react";
import { useCallback, useEffect, useMemo, useState } from "react";

export interface RequestInfoModalProps {
  open: boolean;
  adopterEmail: string;
  onClose: () => void;
  onSubmit: (subject: string, message: string) => Promise<void>;
}

interface TemplateOption {
  id: string;
  label: string;
  text: string;
  icon: ReactElement;
}

export function RequestInfoModal({ open, adopterEmail, onClose, onSubmit }: RequestInfoModalProps) {
  const t = useTranslations("adoptionsAdmin");
  const defaultSubject = t("requestInfo.defaultSubject");

  const [subject, setSubject] = useState(defaultSubject);
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const templates = useMemo<TemplateOption[]>(
    () => [
      {
        id: "home_video",
        label: t("requestInfo.templates.homeVideo.label"),
        text: t("requestInfo.templates.homeVideo.text"),
        icon: <VideocamRoundedIcon fontSize="small" />,
      },
      {
        id: "income_proof",
        label: t("requestInfo.templates.incomeProof.label"),
        text: t("requestInfo.templates.incomeProof.text"),
        icon: <ReceiptLongRoundedIcon fontSize="small" />,
      },
      {
        id: "references",
        label: t("requestInfo.templates.references.label"),
        text: t("requestInfo.templates.references.text"),
        icon: <HomeRoundedIcon fontSize="small" />,
      },
    ],
    [t],
  );

  useEffect(() => {
    if (open) {
      setSubject(defaultSubject);
      setMessage("");
      setError(null);
    }
  }, [defaultSubject, open]);

  const handleTemplateClick = useCallback((templateText: string) => {
    setMessage((prev) => (prev.trim() ? `${prev}\n\n${templateText}` : templateText));
  }, []);

  const resolveErrorMessage = useCallback(
    (errorValue: unknown) => {
      if (errorValue instanceof Error) {
        if (errorValue.message === "errors.adopterEmailNotFound") {
          return t("requestInfo.errors.adopterEmailNotFound");
        }

        if (errorValue.message.startsWith("errors.")) {
          return t(errorValue.message as never);
        }
      }

      return t("requestInfo.errors.sendFailed");
    },
    [t],
  );

  const handleSubmit = async () => {
    setError(null);

    if (!subject.trim()) {
      setError(t("requestInfo.errors.subjectRequired"));
      return;
    }

    if (!message.trim()) {
      setError(t("requestInfo.errors.messageRequired"));
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(subject.trim(), message.trim());
      onClose();
    } catch (submitError) {
      setError(resolveErrorMessage(submitError));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle className="border-b border-slate-100">
        <Box className="flex items-start justify-between gap-4">
          <Box className="flex items-center gap-3">
            <Box className="flex h-10 w-10 items-center justify-center rounded-lg bg-sky-50">
              <MailRoundedIcon className="text-primary" />
            </Box>
            <Box>
              <Typography variant="h6" className="font-bold">
                {t("requestInfo.title")}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {t("requestInfo.description")}
              </Typography>
            </Box>
          </Box>
          <IconButton onClick={handleClose} disabled={isSubmitting} aria-label={t("requestInfo.close")}>
            <CloseRoundedIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent className="space-y-6 pt-6">
        {error ? <Alert severity="error">{error}</Alert> : null}

        <Box className="space-y-2">
          <Typography variant="caption" className="font-bold uppercase tracking-wider text-slate-400">
            {t("requestInfo.to")}
          </Typography>
          <TextField
            value={adopterEmail}
            fullWidth
            disabled
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <AlternateEmailRoundedIcon className="text-slate-400" fontSize="small" />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        <TextField
          label={t("requestInfo.subject")}
          value={subject}
          onChange={(event) => setSubject(event.target.value)}
          fullWidth
          required
          disabled={isSubmitting}
        />

        <Box className="space-y-2">
          <Typography variant="caption" className="font-bold uppercase tracking-wider text-slate-400">
            {t("requestInfo.insertTemplate")}
          </Typography>
          <Box className="flex flex-wrap gap-2">
            {templates.map((template) => (
              <Chip
                key={template.id}
                label={template.label}
                icon={template.icon}
                onClick={() => handleTemplateClick(template.text)}
                disabled={isSubmitting}
                variant="outlined"
                className="cursor-pointer"
              />
            ))}
          </Box>
        </Box>

        <TextField
          label={t("requestInfo.message")}
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          fullWidth
          multiline
          rows={5}
          required
          disabled={isSubmitting}
          placeholder={t("requestInfo.messagePlaceholder")}
        />
      </DialogContent>
      <DialogActions className="border-t border-slate-100 px-6 py-4">
        <Button onClick={handleClose} disabled={isSubmitting}>
          {t("requestInfo.cancel")}
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={isSubmitting || !subject.trim() || !message.trim()}
          startIcon={isSubmitting ? <CircularProgress size={18} color="inherit" /> : <SendRoundedIcon />}
        >
          {t("requestInfo.send")}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
