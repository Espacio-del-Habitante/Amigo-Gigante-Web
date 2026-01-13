import { Dialog, DialogActions, DialogContent, DialogTitle, Typography } from "@mui/material";

import { Button } from "@/presentation/components/atoms/Button";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description: string;
  confirmLabel: string;
  cancelLabel: string;
  onConfirm: () => void;
  onClose: () => void;
}

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel,
  cancelLabel,
  onConfirm,
  onClose,
}: ConfirmDialogProps) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
      </DialogContent>
      <DialogActions className="px-6 pb-4">
        <Button variant="outlined" tone="neutral" onClick={onClose}>
          {cancelLabel}
        </Button>
        <Button variant="solid" tone="primary" onClick={onConfirm}>
          {confirmLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
