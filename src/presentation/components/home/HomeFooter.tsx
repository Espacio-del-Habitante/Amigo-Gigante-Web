import EmailRoundedIcon from "@mui/icons-material/EmailRounded";
import BusinessRoundedIcon from "@mui/icons-material/BusinessRounded";
import { Box, Container, Link, Stack, Typography } from "@mui/material";
import NextLink from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { useMemo } from "react";

import { Logo, Copyright } from "../atoms";

export function HomeFooter() {
  const t = useTranslations("common");
  const locale = useLocale();
  
  const footerLinks = useMemo(
    () => ({
      adopcion: [
        { label: t("footer.links.adoption.dogs"), href: `/${locale}/adopt?species=dog` },
        { label: t("footer.links.adoption.cats"), href: `/${locale}/adopt?species=cat` },
        { label: t("footer.links.adoption.specialCases"), href: `/${locale}/adopt?urgentOnly=true` },
        // { label: t("footer.links.adoption.successStories"), href: "#" }, // Comentado por ahora
      ],
      comunidad: [
        // { label: t("footer.links.community.volunteering"), href: "#" }, // Oculto
        // { label: t("footer.links.community.blog"), href: "#" }, // Oculto
        // { label: t("footer.links.community.events"), href: "#" }, // Oculto
        { label: t("footer.links.community.store"), href: `/${locale}/shop` },
      ],
    }),
    [t, locale],
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
                <Link
                  key={item.label}
                  component={NextLink}
                  href={item.href}
                  underline="none"
                  color="text.secondary"
                  sx={{ fontSize: 14, "&:hover": { color: "primary.main" } }}
                >
                  {item.label}
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
                <Link
                  key={item.label}
                  component={NextLink}
                  href={item.href}
                  underline="none"
                  color="text.secondary"
                  sx={{ fontSize: 14, "&:hover": { color: "primary.main" } }}
                >
                  {item.label}
                </Link>
              ))}
            </Stack>
          </Box>
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 2 }}>
              {t("footer.contact")}
            </Typography>
            <Stack className="gap-3">
              <Stack direction="row" alignItems="center" className="gap-2">
                <EmailRoundedIcon sx={{ fontSize: 18, color: "text.secondary" }} />
                <Link
                  href={`mailto:${t("footer.contactEmail")}`}
                  underline="none"
                  color="text.secondary"
                  sx={{ fontSize: 14, "&:hover": { color: "primary.main" } }}
                >
                  {t("footer.contactEmail")}
                </Link>
              </Stack>
              <Stack direction="row" alignItems="center" className="gap-2">
                <BusinessRoundedIcon sx={{ fontSize: 18, color: "text.secondary" }} />
                <Link
                  component={NextLink}
                  href={`/${locale}/register/foundation`}
                  underline="none"
                  color="text.secondary"
                  sx={{ fontSize: 14, "&:hover": { color: "primary.main" } }}
                >
                  {t("footer.becomeFoundation")}
                </Link>
              </Stack>
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
            <Link component={NextLink} href={`/${locale}/privacy`} underline="none" color="inherit" variant="caption">
              {t("footer.privacy")}
            </Link>
            <Link component={NextLink} href={`/${locale}/terms`} underline="none" color="inherit" variant="caption">
              {t("footer.terms")}
            </Link>
            <Link component={NextLink} href={`/${locale}/cookies`} underline="none" color="inherit" variant="caption">
              {t("footer.cookies")}
            </Link>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}
