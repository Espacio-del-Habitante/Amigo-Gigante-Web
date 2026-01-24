"use client";

import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import ShoppingBagRoundedIcon from "@mui/icons-material/ShoppingBagRounded";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Stack,
  Typography,
} from "@mui/material";
import NextLink from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";

import { Button as AppButton } from "@/presentation/components/atoms/Button";
import { HomeNavBar } from "@/presentation/components/organisms";

import { PURCHASE_CONFIRM_KEY } from "./CheckoutPage";

interface StoredConfirm {
  orderReference: string;
  whatsappLink: string | null;
  orderSummary: {
    buyerName: string;
    buyerEmail: string;
    items: { productName: string; productPrice: number; quantity: number; subtotal: number }[];
    subtotal: number;
    shippingCost: number;
    total: number;
    foundationName: string;
  };
}

export function PurchaseConfirmationPage() {
  const t = useTranslations("purchase");
  const locale = useLocale();
  const router = useRouter();
  const searchParams = useSearchParams();
  const ref = searchParams.get("ref");

  const [data] = useState<StoredConfirm | null>(() => {
    if (typeof window === "undefined" || !ref) return null;
    try {
      const raw = sessionStorage.getItem(PURCHASE_CONFIRM_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw) as StoredConfirm;
      if (parsed.orderReference !== ref) return null;
      return parsed;
    } catch {
      return null;
    }
  });

  const formatPrice = useMemo(
    () => (n: number) =>
      new Intl.NumberFormat(locale, { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(n),
    [locale],
  );

  const invalid = !ref || !data;
  const shopHref = `/${locale}/shop`;
  const handleClose = () => router.push(shopHref);

  return (
    <Box className="min-h-screen bg-neutral-50" sx={{ display: "flex", flexDirection: "column" }}>
      <HomeNavBar />

      <Dialog
        open
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
        BackdropProps={{ className: "bg-neutral-900/60 backdrop-blur-sm" }}
        PaperProps={{ className: "overflow-hidden rounded-2xl border border-neutral-100 shadow-strong" }}
        sx={{ "& .MuiDialog-container": { alignItems: "center", py: 2 } }}
      >
        <DialogContent className="p-6 sm:p-8">
          {invalid ? (
            <Box className="flex flex-col items-center text-center">
              <Box className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-neutral-100">
                <ShoppingBagRoundedIcon sx={{ fontSize: 40 }} color="action" />
              </Box>
              <Typography variant="h5" component="h2" sx={{ fontWeight: 900 }} className="mb-2">
                {t("confirm.invalidTitle")}
              </Typography>
              <Typography variant="body2" color="text.secondary" className="max-w-sm">
                {t("confirm.invalidOrExpired")}
              </Typography>
            </Box>
          ) : (
            <Box className="flex flex-col items-center text-center">
              <Box className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-brand-50">
                <CheckCircleRoundedIcon sx={{ fontSize: 48 }} color="primary" />
              </Box>
              <Typography variant="h5" component="h2" sx={{ fontWeight: 900 }} className="mb-2">
                {t("confirm.title")}
              </Typography>
              <Typography variant="body2" color="text.secondary" className="mb-3 max-w-sm">
                {t("confirm.subtitle")}
              </Typography>
              <Typography variant="body2" color="text.secondary" className="mb-3">
                {t("confirm.reference")}: <strong>#{data!.orderReference}</strong>
              </Typography>
              <Typography variant="body2" color="text.secondary" className="mb-4 max-w-sm">
                {t("confirm.emailsSent")}
              </Typography>

              <Box
                className="w-full rounded-xl border border-neutral-200 bg-neutral-50/80 p-4 text-left"
                sx={{ maxWidth: 400 }}
              >
                <Typography variant="subtitle2" sx={{ fontWeight: 800 }} className="mb-3">
                  {t("voucher.title")}
                </Typography>
                <Typography variant="caption" color="text.secondary" display="block" className="mb-3">
                  {t("voucher.foundation")}: {data!.orderSummary.foundationName}
                </Typography>
                <Stack spacing={1} className="mb-3">
                  {data!.orderSummary.items.map((i, idx) => (
                    <Stack key={idx} direction="row" justifyContent="space-between">
                      <Typography variant="body2">
                        {i.productName} × {i.quantity}
                      </Typography>
                      <Typography variant="body2" fontWeight={700}>
                        {formatPrice(i.subtotal)}
                      </Typography>
                    </Stack>
                  ))}
                </Stack>
                <Stack direction="row" justifyContent="space-between" sx={{ py: 0.75, borderTop: 1, borderColor: "divider" }}>
                  <Typography variant="body2" color="text.secondary">
                    {t("voucher.subtotal")}
                  </Typography>
                  <Typography variant="body2" fontWeight={700}>
                    {formatPrice(data!.orderSummary.subtotal)}
                  </Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between" sx={{ py: 0.75 }}>
                  <Typography variant="body2" color="text.secondary">
                    {t("voucher.shipping")}
                  </Typography>
                  <Typography variant="body2" fontWeight={700}>
                    {formatPrice(data!.orderSummary.shippingCost)}
                  </Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between" sx={{ py: 0.75, borderTop: 1, borderColor: "divider" }}>
                  <Typography variant="subtitle2" fontWeight={800}>
                    {t("voucher.total")}
                  </Typography>
                  <Typography variant="subtitle1" fontWeight={800} color="primary.main">
                    {formatPrice(data!.orderSummary.total)}
                  </Typography>
                </Stack>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions className="flex flex-col gap-3 px-6 pb-6 pt-0 sm:flex-row">
          {invalid ? (
            <AppButton component={NextLink} href={shopHref} variant="solid" tone="primary" fullWidth className="sm:flex-1">
              {t("confirm.backToShop")}
            </AppButton>
          ) : (
            <>
              {data!.whatsappLink ? (
                <Button
                  component="a"
                  href={data!.whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="outlined"
                  color="success"
                  fullWidth
                  className="sm:flex-1"
                  sx={{ fontWeight: 800, py: 1.5, textTransform: "none" }}
                >
                  {t("confirm.whatsapp")}
                </Button>
              ) : null}
              <AppButton component={NextLink} href={shopHref} variant="solid" tone="primary" fullWidth className="sm:flex-1">
                {t("confirm.backToShop")}
              </AppButton>
            </>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
}
