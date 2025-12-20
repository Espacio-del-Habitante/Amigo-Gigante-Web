import { alpha, AppBar, Container, Stack, Toolbar, useTheme } from "@mui/material";

import { Button, Logo } from "@/presentation/components/atoms";
import { NavLink, SearchButton } from "@/presentation/components/molecules";

const navLinks = ["Adopta", "Apadrina", "Fundaciones", "Tienda Solidaria"];

export function HomeNavBar() {
  const theme = useTheme();

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
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ gap: 2, py: { xs: 1, md: 1.5 } }}>
          <Logo size={40} showWordmark />
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
            {navLinks.map((link) => (
              <NavLink key={link} label={link} />
            ))}
          </Stack>
          <Stack direction="row" alignItems="center" spacing={1.5}>
            <SearchButton tone="neutral" variant="ghost" />
            <Button tone="primary" variant="solid" rounded="pill" sx={{ boxShadow: theme.shadows[2], px: 3.5 }}>
              Iniciar Sesión
            </Button>
          </Stack>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
