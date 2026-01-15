import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import { Alert, Box, Button, CircularProgress, Dialog, DialogActions, DialogContent, Typography } from "@mui/material";

import { Button as AppButton } from "@/presentation/components/atoms/Button";

export interface ConfirmDeleteModalProps {
  open: boolean;
  title: string;
  description: string;
  confirmLabel: string;
  cancelLabel: string;
  loadingLabel?: string;
  isLoading?: boolean;
  errorMessage?: string | null;
  onConfirm: () => void;
  onClose: () => void;
}

export function ConfirmDeleteModal({
  open,
  title,
  description,
  confirmLabel,
  cancelLabel,
  loadingLabel,
  isLoading = false,
  errorMessage,
  onConfirm,
  onClose,
}: ConfirmDeleteModalProps) {
  const handleClose = () => {
    if (isLoading) return;
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      BackdropProps={{ className: "bg-neutral-900/60 backdrop-blur-sm" }}
      PaperProps={{ className: "overflow-hidden rounded-xl border border-neutral-100 shadow-strong" }}
    >
      <DialogContent className="p-8">
        <Box className="flex flex-col items-center text-center">
          <Box className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-neutral-100">
            <WarningAmberRoundedIcon color="error" sx={{ fontSize: 36 }} />
          </Box>
          <Typography variant="h5" component="h2" sx={{ fontWeight: 800 }} className="mb-2">
            {title}
          </Typography>
          <Typography variant="body2" color="text.secondary" className="max-w-sm">
            {description}
          </Typography>
          {errorMessage ? (
            <Alert severity="error" className="mt-6 w-full">
              {errorMessage}
            </Alert>
          ) : null}
        </Box>
      </DialogContent>
      <DialogActions className="px-8 pb-8 pt-0">
        <Box className="flex w-full flex-col gap-3 sm:flex-row">
          <AppButton
            tone="neutral"
            variant="outlined"
            rounded="default"
            onClick={handleClose}
            disabled={isLoading}
            className="flex-1"
          >
            {cancelLabel}
          </AppButton>
          <Button
            variant="contained"
            color="error"
            onClick={onConfirm}
            disabled={isLoading}
            className="flex-1"
            sx={{ textTransform: "none", fontWeight: 800, py: 1.5 }}
            startIcon={isLoading ? <CircularProgress size={18} color="inherit" /> : undefined}
          >
            {isLoading && loadingLabel ? loadingLabel : confirmLabel}
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
}
