"use client";

import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";
import PetsRoundedIcon from "@mui/icons-material/PetsRounded";
import StorefrontRoundedIcon from "@mui/icons-material/StorefrontRounded";
import StoreRoundedIcon from "@mui/icons-material/StoreRounded";
import {
  Box,
  Divider,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import { useLocale, useTranslations } from "next-intl";
import { useMemo } from "react";

import { Logo } from "@/presentation/components/atoms";

const SIDEBAR_WIDTH = 256;

export interface FoundationSidebarProps {
  activePath?: string;
  onNavigate?: () => void;
}

export function FoundationSidebar({ activePath, onNavigate }: FoundationSidebarProps) {
  const t = useTranslations("dashboard");
  const locale = useLocale();
  const basePath = `/${locale}/foundations`;

  const navigationItems = useMemo(
    () => [
      {
        key: "dashboard",
        label: t("sidebar.dashboard"),
        icon: <DashboardRoundedIcon fontSize="small" />,
        href: basePath,
      },
      {
        key: "myFoundation",
        label: t("sidebar.myFoundation"),
        icon: <StoreRoundedIcon fontSize="small" />,
        href: `${basePath}/profile`,
      },
      {
        key: "animals",
        label: t("sidebar.animals"),
        icon: <PetsRoundedIcon fontSize="small" />,
        href: `${basePath}/animals`,
      },
      {
        key: "products",
        label: t("sidebar.products"),
        icon: <StorefrontRoundedIcon fontSize="small" />,
        href: `${basePath}/products`,
      },
      {
        key: "adoptions",
        label: t("sidebar.adoptions"),
        icon: <FavoriteRoundedIcon fontSize="small" />,
        href: `${basePath}/adoptions`,
      },
    ],
    [basePath, t],
  );

  return (
    <Box className="flex h-full w-64 flex-col border-r border-neutral-100 bg-neutral-50 px-4 py-6">
      <Box className="flex items-center gap-3 px-2">
        <Logo size={32} />
        <Typography variant="h6" sx={{ fontWeight: 800, color: "text.primary" }}>
          {t("brand.name")}
        </Typography>
      </Box>
      <Divider className="my-6" />
      <List className="flex flex-1 flex-col gap-2" disablePadding>
        {navigationItems.map((item) => {
          const isActive =
            item.key === "dashboard"
              ? activePath === basePath
              : activePath?.startsWith(item.href);

          return (
            <ListItemButton
              key={item.key}
              component="a"
              href={item.href}
              onClick={onNavigate}
              selected={isActive}
              className="flex-none rounded-lg"
              sx={{
                flex: "0 0 auto",
                px: 2,
                py: 1,
                gap: 1.5,
                color: "text.primary",
                "&.Mui-selected": {
                  backgroundColor: "rgba(28, 176, 246, 0.12)",
                  "&:hover": { backgroundColor: "rgba(28, 176, 246, 0.2)" },
                },
                "&:hover": { backgroundColor: "rgba(148, 163, 184, 0.15)" },
              }}
            >
              <ListItemIcon sx={{ minWidth: 0, color: isActive ? "primary.main" : "text.secondary" }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.label}
                primaryTypographyProps={{ fontSize: 14, fontWeight: isActive ? 700 : 500 }}
              />
            </ListItemButton>
          );
        })}
      </List>
      <Divider className="my-4" />
      <Typography variant="caption" color="text.secondary" sx={{ px: 1 }}>
        {t("copyright", { year: new Date().getFullYear() })}
      </Typography>
    </Box>
  );
}

export { SIDEBAR_WIDTH };
