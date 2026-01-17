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
  Skeleton,
  Stack,
  Toolbar,
  Typography,
  useTheme,
  Link,
} from "@mui/material";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import NextLink from "next/link";
import { useLocale } from "next-intl";
import { usePathname } from "next/navigation";
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
  const { isAuthenticated, role, loading: authLoading } = useAuth();

  const adoptHref = `/${locale}/adopt`;
  const foundationsHref = `/${locale}/foundations`;
  const shopHref = `/${locale}/shop`;
  const cartHref = `/${locale}/shop/cart`;

  // Determinar la ruta del dashboard según el rol
  const getDashboardHref = () => {
    if (role === "admin") {
      return `/${locale}/admin`;
    } else if (role === "foundation_user") {
      return `/${locale}/foundations`;
    } else if (role === "external") {
      return `/${locale}/external`;
    }
    return `/${locale}/foundations`; // Default
  };

  const loginButtonHref = isAuthenticated ? getDashboardHref() : `/${locale}/login`;
  const loginButtonText = isAuthenticated ? t("buttons.goToDashboard") : t("buttons.login");

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
            <SearchButton tone="neutral" variant="ghost" />
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

            {authLoading ? (
              <Skeleton
                variant="rounded"
                width={120}
                height={36}
                sx={{
                  borderRadius: "999px",
                  boxShadow: theme.shadows[2],
                }}
              />
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
          {authLoading ? (
            <Skeleton
              variant="rounded"
              width="100%"
              height={40}
              sx={{
                borderRadius: "999px",
              }}
            />
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
