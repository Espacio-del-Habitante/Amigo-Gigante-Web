import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import { alpha, AppBar, Box, Container, Divider, Drawer, IconButton as MuiIconButton, List, ListItem, ListItemButton, Stack, Toolbar, Typography, useTheme } from "@mui/material";
import { useMemo, useState } from "react";

import { Button, Logo } from "@/presentation/components/atoms";
import { NavLink, SearchButton } from "@/presentation/components/molecules";

const navLinks = ["Adopta", "Apadrina", "Fundaciones", "Tienda Solidaria"];

export function HomeNavBar() {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const navItems = useMemo(() => navLinks, []);

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
          <Logo size={40} showWordmark />
          <Box sx={{ flex: 1, display: { xs: "flex", md: "none" }, justifyContent: "flex-end" }}>
            <MuiIconButton
              aria-label="Abrir menú"
              onClick={() => setOpen(true)}
              sx={{
                borderRadius: 2,
                backgroundColor: alpha(theme.palette.primary.main, 0.08),
                "&:hover": { backgroundColor: alpha(theme.palette.primary.main, 0.16) },
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
              <NavLink key={link} label={link} />
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
            <Button tone="primary" variant="solid" rounded="pill" sx={{ boxShadow: theme.shadows[2], px: 3.5, minWidth: 0 }}>
              Iniciar Sesión
            </Button>
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
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ px: 0.5, pb: 1 }}>
          <Logo size={40} showWordmark />
          <MuiIconButton aria-label="Cerrar menú" onClick={() => setOpen(false)}>
            <MenuRoundedIcon />
          </MuiIconButton>
        </Stack>
        <Divider />
        <List sx={{ py: 0 }}>
          {navItems.map((item) => (
            <ListItem key={item} disablePadding>
              <ListItemButton onClick={() => setOpen(false)}>
                <Typography fontWeight={700}>{item}</Typography>
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Divider />
        <Stack spacing={1.5} sx={{ mt: 2 }}>
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <SearchButton tone="neutral" variant="ghost" />
          </Box>
          <Button fullWidth variant="solid" rounded="pill">
            Iniciar Sesión
          </Button>
        </Stack>
      </Drawer>
    </AppBar>
  );
}
