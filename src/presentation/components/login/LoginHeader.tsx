"use client";

import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import { alpha, AppBar, Box, Container, Stack, Toolbar, useTheme } from "@mui/material";
import { useTranslations } from "next-intl";
import Link from "next/link";

import { Button, IconButton, Logo } from "@/presentation/components/atoms";
import { NavLink } from "@/presentation/components/molecules";

export function LoginHeader() {
  const theme = useTheme();
  const t = useTranslations("login");
  const common = useTranslations("common");

  return (
    <AppBar
      position="static"
      color="transparent"
      elevation={0}
      sx={{
        backdropFilter: "blur(12px)",
        backgroundColor: alpha(theme.palette.background.paper, 0.92),
        borderBottom: "1px solid",
        borderColor: "divider",
      }}
    >
      <Container maxWidth="xl" sx={{ maxWidth: 1440, px: { xs: 3, sm: 4 } }}>
        <Toolbar disableGutters sx={{ gap: 2, py: { xs: 1.5, md: 2 } }}>
          <Logo size={40} showWordmark />
          <Stack
            direction="row"
            alignItems="center"
            spacing={3}
            sx={{
              flex: 1,
              display: { xs: "none", lg: "flex" },
              color: "text.secondary",
              ml: 4,
            }}
          >
            <NavLink href="/" label={t("header.home")} />
            <NavLink href="#" label={t("header.about")} />
            <NavLink href="#" label={t("header.contact")} />
          </Stack>
          <Box sx={{ display: { xs: "none", lg: "flex" }, ml: "auto" }}>
            <Button
              component={Link}
              href="/register"
              variant="solid"
              rounded="pill"
              sx={{ px: 3.5, fontWeight: 800, boxShadow: theme.shadows[2] }}
            >
              {t("header.registerFoundation")}
            </Button>
          </Box>
          <Box sx={{ display: { xs: "flex", lg: "none" }, ml: "auto" }}>
            <IconButton aria-label={common("navigation.openMenu")}>
              <MenuRoundedIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
