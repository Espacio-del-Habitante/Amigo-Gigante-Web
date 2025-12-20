import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import { AppBar, Box, Button, Container, IconButton, Stack, Toolbar, Typography } from "@mui/material";
import Image from "next/image";

import Logo from "@/presentation/assets/images/LOGO2.png";

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
        <Toolbar disableGutters className="gap-3 py-2 md:py-3">
          <Stack direction="row" alignItems="center" className="gap-3">
            <Box
              component="span"
              sx={{
                width: 36,
                height: 36,
                borderRadius: "50%",
                backgroundColor: "primary.main",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
                position: "relative",
                flexShrink: 0,
              }}
            >
              <Image
                src={Logo}
                alt="Amigo Gigante logo"
                fill
                sizes="36px"
                style={{
                  objectFit: "contain",
                }}
                priority
              />
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 900, color: "text.primary" }}>
              Amigo Gigante
            </Typography>
          </Stack>
          <Stack direction="row" alignItems="center" className="hidden flex-1 items-center gap-6 text-slate-500 md:flex">
            {["Adopta", "Apadrina", "Fundaciones", "Tienda Solidaria"].map((link) => (
              <Typography key={link} variant="body2" sx={{ fontWeight: 700, cursor: "pointer", "&:hover": { color: "primary.main" } }}>
                {link}
              </Typography>
            ))}
          </Stack>
          <Stack direction="row" alignItems="center" className="gap-3">
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
