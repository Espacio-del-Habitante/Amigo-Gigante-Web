import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import ShoppingCartRoundedIcon from "@mui/icons-material/ShoppingCartRounded";
import {
  alpha,
  AppBar,
  Badge,
  Box,
  Container,
  Divider,
  Drawer,
  IconButton as MuiIconButton,
  List,
  ListItem,
  ListItemButton,
  Menu,
  MenuItem,
  Skeleton,
  Stack,
  Toolbar,
  Typography,
  useTheme,
  Link,
} from "@mui/material";
import type { MouseEvent } from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import NextLink from "next/link";
import { useLocale } from "next-intl";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { keyframes } from "@mui/system";

import { Button, Logo } from "@/presentation/components/atoms";
import {
  LanguageSelector,
  NavLink,
  SearchButton,
} from "@/presentation/components/molecules";
import { useCart } from "@/presentation/hooks/useCart";
import { useAuth } from "@/presentation/hooks/useAuth";

const cartPulse = keyframes`
  0% {
    transform: scale(1);
  }
  40% {
    transform: scale(1.08);
  }
  100% {
    transform: scale(1);
  }
`;

export function HomeNavBar() {
  const theme = useTheme();
  const locale = useLocale();
  const pathname = usePathname();
  const t = useTranslations("common");
  const [open, setOpen] = useState(false);
  const { totalItems } = useCart();
  const [isCartPulsing, setIsCartPulsing] = useState(false);
  const pulseTimeoutRef = useRef<number | null>(null);
  const router = useRouter();
  const { isAuthenticated, role, user, loading: authLoading, logout } = useAuth();
  const [accountMenuAnchor, setAccountMenuAnchor] = useState<null | HTMLElement>(null);
  
  // Estado optimista persistente: usar localStorage para mantener el estado entre navegaciones
  const [optimisticAuth, setOptimisticAuth] = useState<{ isAuthenticated: boolean; role: string | null } | null>(() => {
    if (typeof window === "undefined") return null;
    try {
      const stored = localStorage.getItem("amigo_gigante_auth_state");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  
  // Actualizar estado optimista cuando la sesión cambia
  useEffect(() => {
    if (!authLoading) {
      const newState = isAuthenticated && role 
        ? { isAuthenticated: true, role } 
        : { isAuthenticated: false, role: null };
      
      setOptimisticAuth(newState);
      
      // Persistir en localStorage
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem("amigo_gigante_auth_state", JSON.stringify(newState));
        } catch {
          // Ignorar errores de localStorage
        }
      }
    }
  }, [authLoading, isAuthenticated, role]);
  
  // Limpiar localStorage al hacer logout
  useEffect(() => {
    if (!isAuthenticated && !authLoading && optimisticAuth?.isAuthenticated) {
      if (typeof window !== "undefined") {
        try {
          localStorage.removeItem("amigo_gigante_auth_state");
        } catch {
          // Ignorar errores
        }
      }
      setOptimisticAuth({ isAuthenticated: false, role: null });
    }
  }, [isAuthenticated, authLoading, optimisticAuth]);
  
  // Usar estado optimista si está cargando, sino usar el estado real
  const shouldShowSkeleton = authLoading && optimisticAuth === null;
  const optimisticIsAuthenticated = authLoading && optimisticAuth 
    ? optimisticAuth.isAuthenticated 
    : isAuthenticated;
  const optimisticRole = authLoading && optimisticAuth 
    ? optimisticAuth.role 
    : role;

  const adoptHref = `/${locale}/adopt`;
  const foundationsHref = `/${locale}/foundations`;
  const shopHref = `/${locale}/shop`;
  const cartHref = `/${locale}/shop/cart`;

  // Determinar la ruta del dashboard según el rol
  const getDashboardHref = useCallback(() => {
    const currentRole = optimisticRole || role;
    if (currentRole === "admin") {
      return `/${locale}/admin`;
    } else if (currentRole === "foundation_user") {
      return `/${locale}/foundations`;
    } else if (currentRole === "external") {
      return `/${locale}/account/dashboard`;
    }
    return `/${locale}/foundations`; // Default
  }, [locale, optimisticRole, role]);

  const isExternalUser = optimisticIsAuthenticated && optimisticRole === "external";
  const loginButtonHref = optimisticIsAuthenticated ? getDashboardHref() : `/${locale}/login`;
  const loginButtonText = optimisticIsAuthenticated
    ? isExternalUser
      ? t("buttons.account")
      : t("buttons.goToDashboard")
    : t("buttons.login");

  const isHrefActive = (href: string) => Boolean(pathname) && href !== "#" && pathname === href;

  const handleCartPulse = useCallback(() => {
    if (pulseTimeoutRef.current) {
      window.clearTimeout(pulseTimeoutRef.current);
    }
    setIsCartPulsing(true);
    pulseTimeoutRef.current = window.setTimeout(() => setIsCartPulsing(false), 600);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const handler = () => handleCartPulse();

    window.addEventListener("cart:updated", handler);

    return () => {
      window.removeEventListener("cart:updated", handler);
      if (pulseTimeoutRef.current) {
        window.clearTimeout(pulseTimeoutRef.current);
      }
    };
  }, [handleCartPulse]);

  const handleAccountMenuOpen = useCallback((event: MouseEvent<HTMLElement>) => {
    setAccountMenuAnchor(event.currentTarget);
  }, []);

  const handleAccountMenuClose = useCallback(() => {
    setAccountMenuAnchor(null);
  }, []);

  const handleLogout = useCallback(async () => {
    await logout();
    // Limpiar estado optimista del localStorage
    if (typeof window !== "undefined") {
      try {
        localStorage.removeItem("amigo_gigante_auth_state");
      } catch {
        // Ignorar errores
      }
    }
    setOptimisticAuth({ isAuthenticated: false, role: null });
    handleAccountMenuClose();
    router.push(`/${locale}`);
  }, [handleAccountMenuClose, locale, logout, router]);

  const navItems = useMemo(
    () => [
      { key: "adopt", label: t("navigation.adopt"), href: adoptHref, active: isHrefActive(adoptHref) },
    //  { key: "sponsor", label: t("navigation.sponsor"), href: "#" },
    //  { key: "foundations", label: t("navigation.foundations"), href: foundationsHref, active: isHrefActive(foundationsHref) },
      { key: "store", label: t("navigation.store"), href: shopHref, active: isHrefActive(shopHref) },
    ],
    [adoptHref, foundationsHref, shopHref, t, pathname],
  );

  return (
    <AppBar
      position="sticky"
      color="transparent"
      elevation={0}
      sx={{
        backdropFilter: "blur(10px)",
        backgroundColor: alpha(theme.palette.background.paper, 0.92),
        borderBottom: "1px solid",
        borderColor: "divider",
      }}
    >
      <Container maxWidth="xl" sx={{ maxWidth: 1440, px: { xs: 3, sm: 4 } }}>
        <Toolbar disableGutters sx={{ gap: 2, py: { xs: 1, md: 1.5 } }}>
          <Link href="/" sx={{ textDecoration: "none" }}>
            <Logo size={40} showWordmark />
          </Link>
          <Box
            sx={{
              flex: 1,
              display: { xs: "flex", md: "none" },
              justifyContent: "flex-end",
              gap: 1,
            }}
          >
            <MuiIconButton
              component={NextLink}
              href={cartHref}
              aria-label={t("navigation.cart")}
              sx={{
                borderRadius: 2,
                backgroundColor: alpha(theme.palette.primary.main, 0.08),
                "&:hover": {
                  backgroundColor: alpha(theme.palette.primary.main, 0.16),
                },
                animation: isCartPulsing ? `${cartPulse} 0.6s ease` : "none",
              }}
            >
              <Badge color="error" badgeContent={totalItems} invisible={totalItems <= 0}>
                <ShoppingCartRoundedIcon />
              </Badge>
            </MuiIconButton>
            <MuiIconButton
              aria-label={t("navigation.openMenu")}
              onClick={() => setOpen(true)}
              sx={{
                borderRadius: 2,
                backgroundColor: alpha(theme.palette.primary.main, 0.08),
                "&:hover": {
                  backgroundColor: alpha(theme.palette.primary.main, 0.16),
                },
              }}
            >
              <MenuRoundedIcon />
            </MuiIconButton>
          </Box>
          <Stack
            direction="row"
            alignItems="center"
            sx={{
              flex: 1,
              display: { xs: "none", md: "flex" },
              gap: 3,
              color: "text.secondary",
            }}
          >
            {navItems.map((link) => (
              <NavLink key={link.key} label={link.label} href={link.href} active={Boolean(link.active)} />
            ))}
          </Stack>
          <Stack
            direction="row"
            alignItems="center"
            spacing={1.5}
            sx={{
              display: { xs: "none", md: "flex" },
              backgroundColor: alpha(theme.palette.primary.main, 0.05),
              borderRadius: 999,
              pl: 0.5,
              pr: 0.75,
              py: 0.5,
              boxShadow: theme.shadows[1],
            }}
          >
            {/*<SearchButton tone="neutral" variant="ghost" />*/}
            <LanguageSelector />
            <MuiIconButton
              component={NextLink}
              href={cartHref}
              aria-label={t("navigation.cart")}
              sx={{
                borderRadius: 2,
                backgroundColor: alpha(theme.palette.primary.main, 0.08),
                "&:hover": {
                  backgroundColor: alpha(theme.palette.primary.main, 0.16),
                },
                animation: isCartPulsing ? `${cartPulse} 0.6s ease` : "none",
              }}
            >
              <Badge color="error" badgeContent={totalItems} invisible={totalItems <= 0}>
                <ShoppingCartRoundedIcon />
              </Badge>
            </MuiIconButton>

          {shouldShowSkeleton ? (
            <Skeleton
              variant="rounded"
              width={120}
              height={36}
              sx={{
                borderRadius: "999px",
                boxShadow: theme.shadows[2],
              }}
            />
          ) : isExternalUser ? (
            <>
              <Button
                tone="primary"
                variant="solid"
                rounded="pill"
                onClick={handleAccountMenuOpen}
                sx={{ boxShadow: theme.shadows[2], px: 3.5, minWidth: 0 }}
              >
                {loginButtonText}
              </Button>
              <Menu
                anchorEl={accountMenuAnchor}
                open={Boolean(accountMenuAnchor)}
                onClose={handleAccountMenuClose}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                transformOrigin={{ vertical: "top", horizontal: "right" }}
                slotProps={{
                  paper: {
                    sx: {
                      minWidth: 200,
                      borderRadius: 2,
                      mt: 1,
                    },
                  },
                }}
              >
                {user?.email ? (
                  <Box sx={{ px: 2, py: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      {user.email}
                    </Typography>
                  </Box>
                ) : null}
                <Divider />
                <MenuItem
                  component={NextLink}
                  href={`/${locale}/account/dashboard`}
                  onClick={handleAccountMenuClose}
                >
                  {t("account.menu.myDashboard")}
                </MenuItem>
                <MenuItem
                  component={NextLink}
                  href={`/${locale}/account/adoptions`}
                  onClick={handleAccountMenuClose}
                >
                  {t("account.menu.myRequests")}
                </MenuItem>
                <MenuItem
                  component={NextLink}
                  href={`/${locale}/account`}
                  onClick={handleAccountMenuClose}
                >
                  {t("account.menu.editAccount")}
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleLogout}>
                  {t("account.menu.logout")}
                </MenuItem>
              </Menu>
            </>
          ) : (
            <Link href={loginButtonHref}>
              <Button
                tone="primary"
                variant="solid"
                rounded="pill"
                sx={{ boxShadow: theme.shadows[2], px: 3.5, minWidth: 0 }}
              >
                {loginButtonText}
              </Button>
            </Link>
          )}
        </Stack>
        </Toolbar>
      </Container>
      <Drawer
        anchor="right"
        open={open}
        onClose={() => setOpen(false)}
        slotProps={{
          paper: {
            sx: { width: 280, p: 2, gap: 1.5 },
          },
        }}
      >
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{ px: 0.5, pb: 1 }}
        >
          <Logo size={40} showWordmark />
          <MuiIconButton
            aria-label={t("navigation.closeMenu")}
            onClick={() => setOpen(false)}
          >
            <MenuRoundedIcon />
          </MuiIconButton>
        </Stack>
        <Divider />
        <List sx={{ py: 0 }}>
          {navItems.map((item) => (
            <ListItem key={item.key} disablePadding>
              <ListItemButton
                component={item.href === "#" ? "button" : NextLink}
                href={item.href === "#" ? undefined : item.href}
                onClick={() => setOpen(false)}
              >
                <Typography fontWeight={700}>{item.label}</Typography>
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Divider />
        <Stack spacing={1.5} sx={{ mt: 2 }}>
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <SearchButton tone="neutral" variant="ghost" />
          </Box>
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <LanguageSelector fullWidth />
          </Box>
          {shouldShowSkeleton ? (
            <Skeleton
              variant="rounded"
              width="100%"
              height={40}
              sx={{
                borderRadius: "999px",
              }}
            />
          ) : isExternalUser ? (
            <>
              <Button
                fullWidth
                variant="solid"
                rounded="pill"
                onClick={handleAccountMenuOpen}
              >
                {loginButtonText}
              </Button>
              <Menu
                anchorEl={accountMenuAnchor}
                open={Boolean(accountMenuAnchor)}
                onClose={handleAccountMenuClose}
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
                transformOrigin={{ vertical: "top", horizontal: "right" }}
                slotProps={{
                  paper: {
                    sx: {
                      minWidth: 200,
                      borderRadius: 2,
                      mt: 1,
                    },
                  },
                }}
              >
                {user?.email ? (
                  <Box sx={{ px: 2, py: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      {user.email}
                    </Typography>
                  </Box>
                ) : null}
                <Divider />
                <MenuItem
                  component={NextLink}
                  href={`/${locale}/account/dashboard`}
                  onClick={() => {
                    handleAccountMenuClose();
                    setOpen(false);
                  }}
                >
                  {t("account.menu.myDashboard")}
                </MenuItem>
                <MenuItem
                  component={NextLink}
                  href={`/${locale}/account/adoptions`}
                  onClick={() => {
                    handleAccountMenuClose();
                    setOpen(false);
                  }}
                >
                  {t("account.menu.myRequests")}
                </MenuItem>
                <MenuItem
                  component={NextLink}
                  href={`/${locale}/account`}
                  onClick={() => {
                    handleAccountMenuClose();
                    setOpen(false);
                  }}
                >
                  {t("account.menu.editAccount")}
                </MenuItem>
                <Divider />
                <MenuItem
                  onClick={async () => {
                    await handleLogout();
                    setOpen(false);
                  }}
                >
                  {t("account.menu.logout")}
                </MenuItem>
              </Menu>
            </>
          ) : (
            <Button
              fullWidth
              variant="solid"
              rounded="pill"
              component={NextLink}
              href={loginButtonHref}
            >
              {loginButtonText}
            </Button>
          )}
        </Stack>
      </Drawer>
    </AppBar>
  );
}
