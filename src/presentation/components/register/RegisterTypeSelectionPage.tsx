"use client";

import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import CorporateFareRoundedIcon from "@mui/icons-material/CorporateFareRounded";
import { Box, Container, Stack, Typography } from "@mui/material";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";

import { Button, Logo } from "@/presentation/components/atoms";

export function RegisterTypeSelectionPage() {
  const t = useTranslations("register");
  const locale = useLocale();

  return (
    <Box className="min-h-screen bg-gradient-to-br from-brand-50 via-neutral-50 to-neutral-white">
      <Box className="flex min-h-screen flex-col">
        <Box component="header" className="w-full">
          <Container maxWidth="xl" sx={{ maxWidth: 1440, px: { xs: 3, sm: 4 }, py: { xs: 4, md: 5 } }}>
            <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={3}>
              <Stack direction="row" alignItems="center" spacing={2.5}>
                <Logo size={44} showWordmark />
              </Stack>
              <Stack direction="row" alignItems="center" spacing={1.5} sx={{ display: { xs: "none", md: "flex" } }}>
                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
                  {t("selection.header.login")}
                </Typography>
                <Link
                  href={`/${locale}/login`}
                  className="border-b-2 border-brand-500 text-sm font-bold text-neutral-900 transition-colors hover:text-brand-600"
                >
                  {t("selection.header.loginLink")}
                </Link>
              </Stack>
            </Stack>
          </Container>
        </Box>

        <Container
          maxWidth="xl"
          sx={{
            flex: 1,
            maxWidth: 1440,
            px: { xs: 3, sm: 4 },
            py: { xs: 4, md: 6 },
            display: "flex",
            flexDirection: "column",
            gap: { xs: 6, md: 8 },
            alignItems: "center",
          }}
        >
          <Box className="text-center">
            <Typography variant="h3" sx={{ fontWeight: 900, mb: 2 }}>
              {t("selection.title")}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 640, mx: "auto" }}>
              {t("selection.subtitle")}
            </Typography>
          </Box>

          <Box className="grid w-full max-w-5xl gap-6 md:grid-cols-2">
            <Box className="group relative flex h-full flex-col rounded-2xl border border-neutral-100 bg-white p-7 shadow-soft transition-all duration-300 hover:-translate-y-2 hover:shadow-strong">
              <Box className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-100 text-brand-600">
                <Box component="span" className="material-symbols-outlined text-4xl">
                  pets
                </Box>
              </Box>
              <Box className="flex-1">
                <Typography variant="h5" sx={{ fontWeight: 800, mb: 2 }}>
                  {t("selection.adopter.title")}
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 4, lineHeight: 1.7 }}>
                  {t("selection.adopter.description")}
                </Typography>
              </Box>
              <Button
                component={Link}
                href={`/${locale}/register/external`}
                variant="solid"
                tone="primary"
                rounded="pill"
                endIcon={<ArrowForwardRoundedIcon />}
                sx={{ py: 1.8, fontSize: 15, fontWeight: 800 }}
              >
                {t("selection.adopter.button")}
              </Button>
              <Box className="pointer-events-none absolute inset-0 rounded-2xl border-2 border-transparent transition-colors group-hover:border-brand-200" />
            </Box>

            <Box className="group relative flex h-full flex-col rounded-2xl border border-neutral-100 bg-white p-7 shadow-soft transition-all duration-300 hover:-translate-y-2 hover:shadow-strong">
              <Box className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-accent-100 text-accent-600">
                <Box component="span" className="material-symbols-outlined text-4xl">
                  home_health
                </Box>
              </Box>
              <Box className="flex-1">
                <Typography variant="h5" sx={{ fontWeight: 800, mb: 2 }}>
                  {t("selection.foundation.title")}
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 4, lineHeight: 1.7 }}>
                  {t("selection.foundation.description")}
                </Typography>
              </Box>
              <Button
                component={Link}
                href={`/${locale}/register/foundation`}
                variant="outlined"
                tone="secondary"
                rounded="pill"
                endIcon={<CorporateFareRoundedIcon />}
                sx={{ py: 1.8, fontSize: 15, fontWeight: 800 }}
              >
                {t("selection.foundation.button")}
              </Button>
              <Box className="pointer-events-none absolute inset-0 rounded-2xl border-2 border-transparent transition-colors group-hover:border-accent-200" />
            </Box>
          </Box>

          <Box className="text-center md:hidden">
            <Typography variant="body2" color="text.secondary">
              {t("selection.header.login")} {" "}
              <Link href={`/${locale}/login`} className="font-semibold text-brand-600">
                {t("selection.header.loginLink")}
              </Link>
            </Typography>
          </Box>
        </Container>

        <Box component="footer" className="w-full border-t border-neutral-200 bg-white">
          <Container maxWidth="xl" sx={{ maxWidth: 1440, px: { xs: 3, sm: 4 }, py: { xs: 3, md: 4 } }}>
            <Stack spacing={2} alignItems="center">
              <Stack direction="row" spacing={3} alignItems="center" justifyContent="center" flexWrap="wrap">
                <Link href="#" className="text-sm font-medium text-neutral-500 transition-colors hover:text-neutral-700">
                  {t("selection.footer.about")}
                </Link>
                <Link href="#" className="text-sm font-medium text-neutral-500 transition-colors hover:text-neutral-700">
                  {t("selection.footer.privacy")}
                </Link>
                <Link href="#" className="text-sm font-medium text-neutral-500 transition-colors hover:text-neutral-700">
                  {t("selection.footer.terms")}
                </Link>
                <Link href="#" className="text-sm font-medium text-neutral-500 transition-colors hover:text-neutral-700">
                  {t("selection.footer.contact")}
                </Link>
              </Stack>
              <Typography variant="caption" color="text.secondary">
                {t("selection.footer.copyright")}
              </Typography>
            </Stack>
          </Container>
        </Box>
      </Box>
    </Box>
  );
}
