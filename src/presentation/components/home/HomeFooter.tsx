import { Box, Container, Link, Stack, TextField, Typography, Button } from "@mui/material";

const footerLinks = {
  adopcion: ["Perros", "Gatos", "Casos Especiales", "Historias de éxito"],
  comunidad: ["Voluntariado", "Blog", "Eventos", "Tienda"],
};

export function HomeFooter() {
  return (
    <Box component="footer" className="bg-white pb-6 pt-10 md:pt-12" sx={{ borderTop: "1px solid", borderColor: "divider" }}>
      <Container maxWidth="lg">
        <Box className="mb-8 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <Box>
            <Stack className="gap-3">
              <Stack direction="row" alignItems="center" className="gap-2">
                <Box
                  component="span"
                  sx={{
                    width: 32,
                    height: 32,
                    borderRadius: "50%",
                    backgroundColor: "primary.main",
                    display: "block",
                  }}
                />
                <Typography variant="h6" sx={{ fontWeight: 800, color: "text.primary" }}>
                  Amigo Gigante
                </Typography>
              </Stack>
              <Typography variant="body2" color="text.secondary">
                Conectando corazones y patas desde 2023. Juntos construimos un mundo mejor para ellos.
              </Typography>
              <Stack direction="row" className="gap-2">
                {["FB", "IG", "TW"].map((network) => (
                  <Box
                    key={network}
                    sx={{
                      width: 32,
                      height: 32,
                      borderRadius: "50%",
                      backgroundColor: "#f1f5f9",
                      color: "text.secondary",
                      display: "grid",
                      placeItems: "center",
                      fontSize: 12,
                      fontWeight: 700,
                    }}
                  >
                    {network}
                  </Box>
                ))}
              </Stack>
            </Stack>
          </Box>
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 2 }}>
              Adopción
            </Typography>
            <Stack className="gap-3">
              {footerLinks.adopcion.map((item) => (
                <Link key={item} href="#" underline="none" color="text.secondary" sx={{ fontSize: 14 }}>
                  {item}
                </Link>
              ))}
            </Stack>
          </Box>
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 2 }}>
              Comunidad
            </Typography>
            <Stack className="gap-3">
              {footerLinks.comunidad.map((item) => (
                <Link key={item} href="#" underline="none" color="text.secondary" sx={{ fontSize: 14 }}>
                  {item}
                </Link>
              ))}
            </Stack>
          </Box>
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 2 }}>
              Suscríbete
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
              Recibe las últimas noticias y mascotas destacadas.
            </Typography>
            <Stack direction="row" className="gap-2">
              <TextField size="small" placeholder="Tu email" fullWidth />
              <Button variant="contained" sx={{ fontWeight: 800 }}>
                OK
              </Button>
            </Stack>
          </Box>
        </Box>
        <Stack
          direction={{ xs: "column", md: "row" }}
          justifyContent="space-between"
          alignItems="center"
          className="gap-3 md:flex-row md:items-center md:justify-between"
          sx={{ borderTop: "1px solid", borderColor: "divider", pt: 3 }}
        >
          <Typography variant="caption" color="text.secondary">
            © 2023 Amigo Gigante. Todos los derechos reservados.
          </Typography>
          <Stack direction="row" className="gap-4" color="text.secondary">
            <Link href="#" underline="none" color="inherit" variant="caption">
              Privacidad
            </Link>
            <Link href="#" underline="none" color="inherit" variant="caption">
              Términos
            </Link>
            <Link href="#" underline="none" color="inherit" variant="caption">
              Cookies
            </Link>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}
