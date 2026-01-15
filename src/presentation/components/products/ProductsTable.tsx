"use client";

import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import { Box, IconButton, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material";
import { useTranslations } from "next-intl";

import type { ShopProduct } from "@/domain/models/ShopProduct";
import { ProductPublishToggle } from "@/presentation/components/products/ProductPublishToggle";

export interface ProductsTableProps {
  products: ShopProduct[];
  updatingIds: Set<number>;
  formatPrice: (price: number) => string;
  onTogglePublish: (productId: number, nextValue: boolean) => void;
  onEdit?: (productId: number) => void;
  onDelete?: (product: ShopProduct) => void;
}

export function ProductsTable({
  products,
  updatingIds,
  formatPrice,
  onTogglePublish,
  onEdit,
  onDelete,
}: ProductsTableProps) {
  const t = useTranslations("products");

  return (
    <Box className="overflow-x-auto rounded-2xl border border-neutral-100 bg-white">
      <Table sx={{ minWidth: 960 }}>
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: 800 }}>{t("table.columns.image")}</TableCell>
            <TableCell sx={{ fontWeight: 800 }}>{t("table.columns.details")}</TableCell>
            <TableCell sx={{ fontWeight: 800 }}>{t("table.columns.price")}</TableCell>
            <TableCell sx={{ fontWeight: 800 }}>{t("table.columns.published")}</TableCell>
            <TableCell sx={{ fontWeight: 800, textAlign: "right" }}>{t("table.columns.actions")}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {products.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5}>
                <Typography variant="body2" color="text.secondary">
                  {t("search.noResults")}
                </Typography>
              </TableCell>
            </TableRow>
          ) : (
            products.map((product) => {
              const description = product.description?.trim();

              return (
                <TableRow
                  key={product.id}
                  className="group"
                  hover
                  sx={{
                    "&:hover": { backgroundColor: "rgba(148, 163, 184, 0.08)" },
                  }}
                >
                  <TableCell>
                    <Box
                      className="h-14 w-14 rounded-xl border border-neutral-100 bg-neutral-50 bg-cover bg-center"
                      sx={{
                        backgroundImage: product.imageUrl ? `url(${product.imageUrl})` : "none",
                      }}
                      aria-label={product.name}
                    />
                  </TableCell>

                  <TableCell>
                    <Box className="flex max-w-xs flex-col">
                      <Typography variant="body2" sx={{ fontWeight: 800 }}>
                        {product.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {description ? description : t("table.noDescription")}
                      </Typography>
                    </Box>
                  </TableCell>

                  <TableCell>
                    {product.price === null ? (
                      <Typography variant="body2" color="text.secondary">
                        {t("table.priceUnavailable")}
                      </Typography>
                    ) : (
                      <Typography variant="body2" sx={{ fontWeight: 800, color: "primary.main" }}>
                        {formatPrice(product.price)}
                      </Typography>
                    )}
                  </TableCell>

                  <TableCell>
                    <ProductPublishToggle
                      productId={product.id}
                      productName={product.name}
                      isPublished={product.isPublished}
                      isUpdating={updatingIds.has(product.id)}
                      onToggle={onTogglePublish}
                    />
                  </TableCell>

                  <TableCell sx={{ textAlign: "right" }}>
                    <Box className="inline-flex items-center justify-end gap-1 opacity-0 transition-opacity duration-150 group-hover:opacity-100 group-focus-within:opacity-100">
                      <IconButton
                        size="small"
                        aria-label={t("table.actions.edit")}
                        title={t("table.actions.edit")}
                        sx={{ color: "text.secondary" }}
                        onClick={() => onEdit?.(product.id)}
                      >
                        <EditRoundedIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        aria-label={t("table.actions.delete")}
                        title={t("table.actions.delete")}
                        sx={{ color: "text.secondary" }}
                        disabled={!onDelete}
                        onClick={() => onDelete?.(product)}
                      >
                        <DeleteOutlineRoundedIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </Box>
  );
}
