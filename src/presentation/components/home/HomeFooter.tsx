import { Box, Button, Container, Link, Stack, TextField, Typography } from "@mui/material";
import { useMemo } from "react";
import { useTranslations } from "next-intl";

import { Logo, Copyright } from "../atoms";

export function HomeFooter() {
  const t = useTranslations("common");
  const footerLinks = useMemo(
    () => ({
      adopcion: [
        t("footer.links.adoption.dogs"),
        t("footer.links.adoption.cats"),
        t("footer.links.adoption.specialCases"),
        t("footer.links.adoption.successStories"),
      ],
      comunidad: [
        t("footer.links.community.volunteering"),
        t("footer.links.community.blog"),
        t("footer.links.community.events"),
        t("footer.links.community.store"),
      ],
    }),
    [t],
  );

  return (
    <Box component="footer" className="bg-white pb-6 pt-10 md:pt-12" sx={{ borderTop: "1px solid", borderColor: "divider" }}>
      <Container maxWidth="xl" sx={{ maxWidth: 1440, px: { xs: 3, sm: 4 } }}>
        <Box className="mb-8 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <Box>
            <Stack className="gap-3">
              <Stack direction="row" alignItems="center" className="gap-2">
              <Logo size={40} showWordmark />
         
              </Stack>
              <Typography variant="body2" color="text.secondary">
                {t("footer.description")}
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
              {t("footer.adoption")}
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
              {t("footer.community")}
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
              {t("footer.subscribe")}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
              {t("footer.subscribeDescription")}
            </Typography>
            <Stack direction="row" className="gap-2">
              <TextField size="small" placeholder={t("footer.emailPlaceholder")} fullWidth />
              <Button variant="contained" sx={{ fontWeight: 800 }}>
                {t("buttons.ok")}
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
          <Copyright variant="caption" />
          <Stack direction="row" className="gap-4" color="text.secondary">
            <Link href="#" underline="none" color="inherit" variant="caption">
              {t("footer.privacy")}
            </Link>
            <Link href="#" underline="none" color="inherit" variant="caption">
              {t("footer.terms")}
            </Link>
            <Link href="#" underline="none" color="inherit" variant="caption">
              {t("footer.cookies")}
            </Link>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}
