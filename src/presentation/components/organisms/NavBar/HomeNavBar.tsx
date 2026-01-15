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
  Stack,
  Toolbar,
  Typography,
  useTheme,
  Link,
} from "@mui/material";
import { useMemo, useState } from "react";
import NextLink from "next/link";
import { useLocale } from "next-intl";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";

import { Button, Logo } from "@/presentation/components/atoms";
import {
  LanguageSelector,
  NavLink,
  SearchButton,
} from "@/presentation/components/molecules";
import { useCart } from "@/presentation/hooks/useCart";

export function HomeNavBar() {
  const theme = useTheme();
  const locale = useLocale();
  const pathname = usePathname();
  const t = useTranslations("common");
  const [open, setOpen] = useState(false);
  const { totalItems } = useCart();

  const adoptHref = `/${locale}/adopt`;
  const foundationsHref = `/${locale}/foundations`;
  const shopHref = `/${locale}/shop`;
  const cartHref = `/${locale}/shop/cart`;

  const isHrefActive = (href: string) => Boolean(pathname) && href !== "#" && pathname === href;

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
              }}
            >
              <Badge color="error" badgeContent={totalItems} invisible={totalItems <= 0}>
                <ShoppingCartRoundedIcon />
              </Badge>
            </MuiIconButton>

            <Link href={`/${locale}/login`}>
              <Button
                tone="primary"
                variant="solid"
                rounded="pill"
                sx={{ boxShadow: theme.shadows[2], px: 3.5, minWidth: 0 }}
              >
                {t("buttons.login")}
              </Button>
            </Link>
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
          <Button fullWidth variant="solid" rounded="pill">
            {t("buttons.login")}
          </Button>
        </Stack>
      </Drawer>
    </AppBar>
  );
}
