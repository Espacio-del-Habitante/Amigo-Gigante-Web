"use client";

import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import { AppBar, Avatar, Box, Divider, IconButton, Menu, MenuItem, Toolbar, Typography } from "@mui/material";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import type { MouseEvent } from "react";
import { useMemo, useState } from "react";

import { LogoutUseCase } from "@/domain/usecases/auth/LogoutUseCase";
import { appContainer } from "@/infrastructure/ioc/container";
import { USE_CASE_TYPES } from "@/infrastructure/ioc/usecases/usecases.types";
import { Logo } from "@/presentation/components/atoms";
import { NotificationBell } from "@/presentation/components/molecules";
import { useAuth } from "@/presentation/hooks/useAuth";
import { getInitialsFromEmail, getNameFromEmail } from "@/presentation/utils/userUtils";

export interface FoundationHeaderProps {
  onOpenMenu: () => void;
}

export function FoundationHeader({ onOpenMenu }: FoundationHeaderProps) {
  const t = useTranslations("dashboard");
  const { user, loading } = useAuth();
  const locale = useLocale();
  const router = useRouter();
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const logoutUseCase = useMemo(
    () => appContainer.get<LogoutUseCase>(USE_CASE_TYPES.LogoutUseCase),
    [],
  );

  const handleMenuOpen = (event: MouseEvent<HTMLElement>) => {
    setMenuAnchor(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
  };

  const handleLogout = async () => {
    try {
      await logoutUseCase.execute();
      router.push(`/${locale}`);
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    } finally {
      handleMenuClose();
    }
  };

  const displayName = useMemo(() => {
    if (!user?.email) return t("header.user.name");
    return getNameFromEmail(user.email);
  }, [user?.email, t]);

  const displayEmail = useMemo(() => {
    return user?.email || t("header.user.email");
  }, [user?.email, t]);

  const initials = useMemo(() => {
    if (!user?.email) return t("header.user.initials");
    return getInitialsFromEmail(user.email);
  }, [user?.email, t]);

  const isMenuOpen = Boolean(menuAnchor);

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        backgroundColor: "background.paper",
        borderBottom: "1px solid",
        borderColor: "divider",
        color: "text.primary",
      }}
    >
      <Toolbar className="flex min-h-[72px] items-center gap-4 px-4 md:px-8">
        <Box className="flex flex-1 items-center gap-3 md:hidden">
          <IconButton aria-label={t("header.menu")} onClick={onOpenMenu}>
            <MenuRoundedIcon />
          </IconButton>
          <Box className="flex items-center gap-2">
            <Logo size={28} />
            <Typography variant="h6" sx={{ fontWeight: 800 }}>
              {t("brand.name")}
            </Typography>
          </Box>
        </Box>
        <Box className="hidden flex-1 md:block" />
        <Box className="flex items-center gap-4">
          <NotificationBell />
          {!loading && (
            <Box
              className="flex items-center gap-3 cursor-pointer"
              onClick={handleMenuOpen}
              role="button"
              tabIndex={0}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  handleMenuOpen(event as unknown as MouseEvent<HTMLElement>);
                }
              }}
              sx={{ cursor: "pointer" }}
            >
              <Box className="hidden text-right sm:block">
                <Typography variant="body2" sx={{ fontWeight: 700 }}>
                  {displayName}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {displayEmail}
                </Typography>
              </Box>
              <Avatar sx={{ width: 40, height: 40, bgcolor: "primary.main" }}>
                {initials}
              </Avatar>
            </Box>
          )}
        </Box>
      </Toolbar>
      <Menu
        anchorEl={menuAnchor}
        open={isMenuOpen}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        MenuListProps={{ dense: true }}
      >
        {user?.email && (
          <MenuItem disabled sx={{ opacity: 1, cursor: "default" }}>
            <Typography variant="caption" color="text.secondary">
              {user.email}
            </Typography>
          </MenuItem>
        )}
        <Divider />
        <MenuItem
          component={Link}
          href={`/${locale}/foundations/profile`}
          onClick={handleMenuClose}
        >
          {t("header.user.menu.editProfile")}
        </MenuItem>
        <MenuItem onClick={handleLogout}>{t("header.user.menu.logout")}</MenuItem>
      </Menu>
    </AppBar>
  );
}
