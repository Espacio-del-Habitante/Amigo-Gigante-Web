import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import { AppBar, Box, Button, Container, IconButton, Stack, Toolbar, Typography } from "@mui/material";

export function HomeNavBar() {
  return (
    <AppBar
      position="sticky"
      color="transparent"
      elevation={0}
      sx={{
        backdropFilter: "blur(10px)",
        backgroundColor: "rgba(255,255,255,0.92)",
        borderBottom: "1px solid",
        borderColor: "divider",
      }}
    >
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ py: 1, gap: 3 }}>
          <Stack direction="row" spacing={1.2} alignItems="center">
            <Box
              component="span"
              sx={{
                width: 36,
                height: 36,
                borderRadius: "50%",
                backgroundColor: "primary.main",
                display: "block",
              }}
            />
            <Typography variant="h6" sx={{ fontWeight: 900, color: "text.primary" }}>
              Amigo Gigante
            </Typography>
          </Stack>
          <Stack
            direction="row"
            spacing={3}
            alignItems="center"
            sx={{ flex: 1, display: { xs: "none", md: "flex" }, color: "text.secondary" }}
          >
            {["Adopta", "Apadrina", "Fundaciones", "Tienda Solidaria"].map((link) => (
              <Typography key={link} variant="body2" sx={{ fontWeight: 700, cursor: "pointer", "&:hover": { color: "primary.main" } }}>
                {link}
              </Typography>
            ))}
          </Stack>
          <Stack direction="row" spacing={1.5} alignItems="center">
            <IconButton>
              <SearchRoundedIcon />
            </IconButton>
            <Button
              variant="contained"
              sx={{
                borderRadius: 999,
                px: 3,
                fontWeight: 800,
                textTransform: "none",
                boxShadow: "0 12px 24px rgba(28,176,246,0.35)",
              }}
            >
              Iniciar Sesión
            </Button>
          </Stack>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
