"use client";

import { Box, Container, Link, Stack, Typography } from "@mui/material";
import NextLink from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { type ReactNode } from "react";

import { HomeFooter } from "@/presentation/components/home/HomeFooter";
import { HomeNavBar } from "@/presentation/components/organisms";

interface LegalContentProps {
  title: string;
  updatedAtLabel: string;
  updatedAtDate: string;
  intro?: string;
  children: ReactNode;
}

interface LegalSectionProps {
  title: string;
  body?: string;
  intro?: string;
  items?: string[];
  highlight?: string;
}

export function LegalSection({ title, body, intro, items, highlight }: LegalSectionProps) {
  return (
    <Stack spacing={1.5} component="section">
      <Typography variant="h5" sx={{ fontWeight: 800 }}>
        {title}
      </Typography>
      {intro && (
        <Typography variant="body1" color="text.secondary">
          {intro}
        </Typography>
      )}
      {body && (
        <Typography variant="body1" color="text.secondary">
          {body}
        </Typography>
      )}
      {items && items.length > 0 && (
        <Box component="ul" className="list-disc pl-6 text-sm text-neutral-600">
          {items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </Box>
      )}
      {highlight && (
        <Box className="rounded-xl border border-neutral-200 bg-neutral-50 p-4">
          <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
            {highlight}
          </Typography>
        </Box>
      )}
    </Stack>
  );
}

export function LegalContent({ title, updatedAtLabel, updatedAtDate, intro, children }: LegalContentProps) {
  const t = useTranslations("legal");
  const locale = useLocale();

  return (
    <Box className="bg-slate-50">
      <HomeNavBar />
      <Box component="main" className="bg-white">
        <Container maxWidth="lg" sx={{ px: { xs: 3, sm: 4 }, py: { xs: 6, md: 8 } }}>
          <Stack spacing={4}>
            <Stack spacing={1.5}>
              <Typography variant="h3" sx={{ fontWeight: 900, letterSpacing: -0.5 }}>
                {title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {updatedAtLabel} {updatedAtDate}
              </Typography>
              {intro && (
                <Typography variant="body1" color="text.secondary">
                  {intro}
                </Typography>
              )}
            </Stack>
            <Stack spacing={4}>{children}</Stack>
            <Box className="rounded-2xl border border-neutral-200 bg-neutral-50 p-6">
              <Stack spacing={2}>
                <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
                  {t("footer.title")}
                </Typography>
                <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                  <Link
                    component={NextLink}
                    href={`/${locale}/privacy`}
                    underline="none"
                    color="text.secondary"
                    sx={{ fontWeight: 600, "&:hover": { color: "primary.main" } }}
                  >
                    {t("footer.links.privacy")}
                  </Link>
                  <Link
                    component={NextLink}
                    href={`/${locale}/terms`}
                    underline="none"
                    color="text.secondary"
                    sx={{ fontWeight: 600, "&:hover": { color: "primary.main" } }}
                  >
                    {t("footer.links.terms")}
                  </Link>
                  <Link
                    component={NextLink}
                    href={`/${locale}/cookies`}
                    underline="none"
                    color="text.secondary"
                    sx={{ fontWeight: 600, "&:hover": { color: "primary.main" } }}
                  >
                    {t("footer.links.cookies")}
                  </Link>
                </Stack>
                <Typography variant="body2" color="text.secondary">
                  {t("footer.contact", { email: t("footer.contactEmail") })}
                </Typography>
              </Stack>
            </Box>
          </Stack>
        </Container>
      </Box>
      <HomeFooter />
    </Box>
  );
}
