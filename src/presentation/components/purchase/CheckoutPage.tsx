"use client";

import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import NextLink from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";

import type { ShopProduct } from "@/domain/models/ShopProduct";
import { CreatePurchaseOrderUseCase } from "@/domain/usecases/purchase/CreatePurchaseOrderUseCase";
import { GetCartProductsUseCase } from "@/domain/usecases/cart/GetCartProductsUseCase";
import { appContainer } from "@/infrastructure/ioc/container";
import { USE_CASE_TYPES } from "@/infrastructure/ioc/usecases/usecases.types";
import { HomeFooter } from "@/presentation/components/home/HomeFooter";
import { HomeNavBar } from "@/presentation/components/organisms";
import { useAuth } from "@/presentation/hooks/useAuth";
import { useCart } from "@/presentation/hooks/useCart";

const PURCHASE_CONFIRM_KEY = "amigo-gigante-purchase-confirm";

export function CheckoutPage() {
  const t = useTranslations("purchase");
  const locale = useLocale();
  const router = useRouter();
  const { user } = useAuth();
  const { items, refresh, updateItemQuantity } = useCart();

  const getCartProductsUseCase = useMemo(
    () => appContainer.get<GetCartProductsUseCase>(USE_CASE_TYPES.GetCartProductsUseCase),
    [],
  );
  const createOrderUseCase = useMemo(
    () => appContainer.get<CreatePurchaseOrderUseCase>(USE_CASE_TYPES.CreatePurchaseOrderUseCase),
    [],
  );

  const [products, setProducts] = useState<ShopProduct[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const formatPrice = useMemo(
    () => (n: number) =>
      new Intl.NumberFormat(locale, { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(n),
    [locale],
  );

  const productIds = useMemo(() => items.map((i) => i.productId), [items]);
  const productsById = useMemo(() => new Map(products.map((p) => [p.id, p] as const)), [products]);
  const detailedItems = useMemo(() => {
    return items
      .map((it) => {
        const p = productsById.get(it.productId);
        if (!p) return null;
        return { item: it, product: p };
      })
      .filter((e): e is { item: (typeof items)[number]; product: ShopProduct } => Boolean(e));
  }, [items, productsById]);

  const foundationIds = useMemo(() => {
    const ids = new Set(detailedItems.map((e) => e.product.foundationId));
    return Array.from(ids);
  }, [detailedItems]);

  const singleFoundation = foundationIds.length <= 1;
  const foundationId = foundationIds[0] ?? null;

  const subtotal = useMemo(
    () =>
      detailedItems.reduce((s, e) => s + (e.product.price ?? 0) * e.item.quantity, 0),
    [detailedItems],
  );
  const shippingCost = 0;
  const total = subtotal + shippingCost;

  useEffect(() => {
    let active = true;
    if (productIds.length === 0) {
      setProducts([]);
      setLoadingProducts(false);
      return;
    }
    setLoadingProducts(true);
    getCartProductsUseCase
      .execute({ productIds })
      .then((r) => {
        if (active) setProducts(r.products);
      })
      .catch(() => {
        if (active) setProducts([]);
      })
      .finally(() => {
        if (active) setLoadingProducts(false);
      });
    return () => {
      active = false;
    };
  }, [getCartProductsUseCase, productIds]);

  const validationSchema = useMemo(
    () =>
      Yup.object().shape({
        buyerName: Yup.string()
          .trim()
          .required(t("validation.buyerNameRequired"))
          .min(2, t("validation.buyerNameMin")),
        buyerEmail: Yup.string()
          .trim()
          .required(t("validation.buyerEmailRequired"))
          .email(t("validation.buyerEmailInvalid")),
        buyerPhone: Yup.string().trim().notRequired(),
        buyerAddress: Yup.string().trim().notRequired(),
        buyerCity: Yup.string().trim().notRequired(),
        buyerCountry: Yup.string().trim().notRequired(),
        notes: Yup.string().trim().notRequired(),
      }),
    [t],
  );

  const formik = useFormik({
    initialValues: {
      buyerName: "",
      buyerEmail: user?.email ?? "",
      buyerPhone: "",
      buyerAddress: "",
      buyerCity: "",
      buyerCountry: "",
      notes: "",
    },
    validationSchema,
    onSubmit: async (vals) => {
      if (!foundationId || !singleFoundation) return;
      setSubmitError(null);
      setSubmitting(true);
      try {
        const orderReference = crypto.randomUUID();
        const result = await createOrderUseCase.execute({
          orderReference,
          userId: user?.id ?? null,
          foundationId,
          buyerName: vals.buyerName,
          buyerEmail: vals.buyerEmail,
          buyerPhone: vals.buyerPhone || null,
          buyerAddress: vals.buyerAddress || null,
          buyerCity: vals.buyerCity || null,
          buyerCountry: vals.buyerCountry || null,
          notes: vals.notes || null,
          shippingCost,
          items: detailedItems.map((e) => ({
            productId: e.product.id,
            productName: e.product.name,
            productPrice: e.product.price ?? 0,
            quantity: e.item.quantity,
          })),
        });

        const payload = {
          orderReference: result.orderReference,
          whatsappLink: result.whatsappLink,
          orderSummary: result.orderSummary,
        };
        if (typeof window !== "undefined") {
          sessionStorage.setItem(PURCHASE_CONFIRM_KEY, JSON.stringify(payload));
        }

        for (const { item } of detailedItems) {
          await updateItemQuantity(item.productId, 0);
        }
        await refresh();

        router.push(`/${locale}/shop/checkout/confirm?ref=${encodeURIComponent(orderReference)}`);
      } catch (err) {
        setSubmitError(err instanceof Error ? err.message : "errors.generic");
      } finally {
        setSubmitting(false);
      }
    },
  });

  useEffect(() => {
    if (user?.email && !formik.values.buyerEmail) {
      formik.setFieldValue("buyerEmail", user.email);
    }
  }, [user?.email]);

  const isLoading = loadingProducts;
  const isEmpty = !isLoading && detailedItems.length === 0;
  const canSubmit = singleFoundation && foundationId && detailedItems.length > 0 && !submitting;

  return (
    <Box className="min-h-screen bg-neutral-50" sx={{ display: "flex", flexDirection: "column" }}>
      <HomeNavBar />
      <Container maxWidth="xl" sx={{ maxWidth: 1280, px: { xs: 3, sm: 4 }, py: { xs: 4, md: 6 } }}>
        <Stack spacing={1} sx={{ mb: 4 }}>
          <Typography
            component={NextLink}
            href={`/${locale}/shop/cart`}
            variant="body2"
            color="primary"
            sx={{ textDecoration: "none", fontWeight: 700 }}
          >
            {t("checkout.backToCart")}
          </Typography>
          <Typography variant="h4" sx={{ fontWeight: 900 }}>
            {t("checkout.title")}
          </Typography>
        </Stack>

        {isLoading ? (
          <Stack alignItems="center" justifyContent="center" sx={{ py: 12 }}>
            <CircularProgress aria-label={t("checkout.title")} />
          </Stack>
        ) : isEmpty ? (
          <Stack spacing={2}>
            <Alert severity="info">{t("checkout.emptyCart")}</Alert>
            <Button component={NextLink} href={`/${locale}/shop/cart`} variant="contained" sx={{ alignSelf: "flex-start" }}>
              {t("checkout.backToCart")}
            </Button>
          </Stack>
        ) : !singleFoundation ? (
          <Alert severity="warning">{t("checkout.singleFoundationRequired")}</Alert>
        ) : (
          <Box
            component="form"
            onSubmit={formik.handleSubmit}
            className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_360px]"
          >
            <Stack spacing={3}>
              <TextField
                fullWidth
                id="buyerName"
                name="buyerName"
                label={t("checkout.form.buyerName")}
                value={formik.values.buyerName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.buyerName && Boolean(formik.errors.buyerName)}
                helperText={formik.touched.buyerName && formik.errors.buyerName}
              />
              <TextField
                fullWidth
                id="buyerEmail"
                name="buyerEmail"
                type="email"
                label={t("checkout.form.buyerEmail")}
                value={formik.values.buyerEmail}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.buyerEmail && Boolean(formik.errors.buyerEmail)}
                helperText={formik.touched.buyerEmail && formik.errors.buyerEmail}
              />
              <TextField
                fullWidth
                id="buyerPhone"
                name="buyerPhone"
                label={t("checkout.form.buyerPhone")}
                value={formik.values.buyerPhone}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              <TextField
                fullWidth
                id="buyerAddress"
                name="buyerAddress"
                label={t("checkout.form.buyerAddress")}
                value={formik.values.buyerAddress}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              <Stack direction="row" spacing={2}>
                <TextField
                  fullWidth
                  id="buyerCity"
                  name="buyerCity"
                  label={t("checkout.form.buyerCity")}
                  value={formik.values.buyerCity}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                <TextField
                  fullWidth
                  id="buyerCountry"
                  name="buyerCountry"
                  label={t("checkout.form.buyerCountry")}
                  value={formik.values.buyerCountry}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </Stack>
              <TextField
                fullWidth
                id="notes"
                name="notes"
                label={t("checkout.form.notes")}
                multiline
                rows={2}
                value={formik.values.notes}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {submitError ? (
                <Alert severity="error">
                  {submitError.startsWith("errors.") && (submitError === "errors.emailQueueEnqueue" || submitError === "errors.connection")
                    ? t(submitError as "errors.emailQueueEnqueue" | "errors.connection")
                    : t("errors.generic")}
                </Alert>
              ) : null}
            </Stack>

            <Box
              sx={{
                bgcolor: "background.paper",
                borderRadius: 2,
                border: "1px solid",
                borderColor: "divider",
                p: 3,
                position: { lg: "sticky" },
                top: { lg: 112 },
                height: "fit-content",
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 900, mb: 2 }}>
                {t("checkout.summary")}
              </Typography>
              <Stack spacing={1} sx={{ mb: 2 }}>
                {detailedItems.map(({ item, product }) => (
                  <Stack key={product.id} direction="row" justifyContent="space-between">
                    <Typography variant="body2">
                      {product.name} × {item.quantity}
                    </Typography>
                    <Typography variant="body2" fontWeight={700}>
                      {formatPrice((product.price ?? 0) * item.quantity)}
                    </Typography>
                  </Stack>
                ))}
              </Stack>
              <Stack direction="row" justifyContent="space-between" sx={{ py: 1, borderTop: 1, borderColor: "divider" }}>
                <Typography variant="body2" color="text.secondary">
                  {t("voucher.subtotal")}
                </Typography>
                <Typography variant="body2" fontWeight={700}>
                  {formatPrice(subtotal)}
                </Typography>
              </Stack>
              <Stack direction="row" justifyContent="space-between" sx={{ py: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  {t("voucher.shipping")}
                </Typography>
                <Typography variant="body2" fontWeight={700}>
                  {formatPrice(shippingCost)}
                </Typography>
              </Stack>
              <Stack direction="row" justifyContent="space-between" sx={{ py: 1, borderTop: 1, borderColor: "divider" }}>
                <Typography variant="subtitle1" fontWeight={900}>
                  {t("voucher.total")}
                </Typography>
                <Typography variant="h6" fontWeight={900} color="primary.main">
                  {formatPrice(total)}
                </Typography>
              </Stack>
              <Button
                type="submit"
                variant="contained"
                fullWidth
                size="large"
                disabled={!canSubmit}
                sx={{ mt: 2, fontWeight: 700 }}
              >
                {submitting ? <CircularProgress size={24} color="inherit" /> : t("checkout.submit")}
              </Button>
            </Box>
          </Box>
        )}
      </Container>
      <HomeFooter />
    </Box>
  );
}

export { PURCHASE_CONFIRM_KEY };
