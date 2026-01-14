"use client";

import PetsRoundedIcon from "@mui/icons-material/PetsRounded";
import { Box, Stack, Typography, useTheme } from "@mui/material";
import { useTranslations } from "next-intl";

import type { ShopFoundation } from "@/domain/models/ShopFoundation";
import type { ShopProduct } from "@/domain/models/ShopProduct";

import { Button } from "@/presentation/components/atoms";
import { ShopProductCard } from "./ShopProductCard";

export interface ShopFoundationSectionProps {
  foundation: ShopFoundation;
  products: ShopProduct[];
  onViewAll: (foundationId: string) => void;
  formatPrice: (price: number) => string;
  showDonationCard?: boolean;
}

export function ShopFoundationSection({
  foundation,
  products,
  onViewAll,
  formatPrice,
  showDonationCard = false,
}: ShopFoundationSectionProps) {
  const theme = useTheme();
  const t = useTranslations("shop");

  const location = [foundation.city, foundation.country].filter(Boolean).join(", ");

  return (
    <Box component="section">
      <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
        <Box
          sx={{
            width: 44,
            height: 44,
            borderRadius: 3,
            display: "grid",
            placeItems: "center",
            backgroundColor: theme.palette.primary.main + "1A",
          }}
        >
          <PetsRoundedIcon sx={{ color: "primary.main" }} />
        </Box>
        <Box sx={{ minWidth: 0 }}>
          <Typography variant="h6" sx={{ fontWeight: 900, lineHeight: 1.2 }}>
            {foundation.name}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.25 }}>
            {location || t("foundation.noLocation")}
          </Typography>
        </Box>
        <Box sx={{ flex: 1 }} />
        <Button
          tone="primary"
          variant="ghost"
          rounded="pill"
          onClick={() => onViewAll(foundation.id)}
          sx={{ fontWeight: 800 }}
        >
          {t("foundation.viewAll")}
        </Button>
      </Stack>

      <Box className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {products.map((product) => (
          <ShopProductCard
            key={product.id}
            product={product}
            formattedPrice={product.price === null ? "" : formatPrice(product.price)}
          />
        ))}

        {showDonationCard ? (
          <Box
            sx={{
              borderRadius: 3,
              background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              color: "common.white",
              boxShadow: theme.shadows[4],
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              p: 3,
              minHeight: 320,
            }}
          >
            <Stack spacing={1.25} alignItems="center" sx={{ maxWidth: 280 }}>
              <Typography variant="h6" sx={{ fontWeight: 900 }}>
                {t("donationCard.title")}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.92, lineHeight: 1.6 }}>
                {t("donationCard.description")}
              </Typography>
              <Button
                tone="neutral"
                rounded="default"
                sx={{
                  mt: 1,
                  backgroundColor: "common.white",
                  color: "primary.main",
                  "&:hover": { backgroundColor: "common.white" },
                  fontWeight: 900,
                  width: "100%",
                }}
              >
                {t("donationCard.cta")}
              </Button>
            </Stack>
          </Box>
        ) : null}
      </Box>
    </Box>
  );
}

