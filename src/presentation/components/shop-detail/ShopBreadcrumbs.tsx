\"use client\";

import ArrowBackRoundedIcon from \"@mui/icons-material/ArrowBackRounded\";
import ChevronRightRoundedIcon from \"@mui/icons-material/ChevronRightRounded\";
import { Breadcrumbs, Link as MuiLink, Stack, Typography } from \"@mui/material\";
import NextLink from \"next/link\";
import { useTranslations } from \"next-intl\";

interface ShopBreadcrumbsProps {
  name: string;
  locale: string;
}

export function ShopBreadcrumbs({ name, locale }: ShopBreadcrumbsProps) {
  const t = useTranslations(\"shopDetail\");

  return (
    <Breadcrumbs
      aria-label={t(\"breadcrumbs.navigation\")}
      separator={<ChevronRightRoundedIcon fontSize=\"small\" />}
      sx={{ color: \"text.secondary\", fontWeight: 600 }}
    >
      <MuiLink component={NextLink} href={`/${locale}/shop`} underline=\"hover\" color=\"inherit\">
        <Stack direction=\"row\" alignItems=\"center\" spacing={0.75}>
          <ArrowBackRoundedIcon fontSize=\"small\" />
          <span>{t(\"breadcrumbs.backToShop\")}</span>
        </Stack>
      </MuiLink>
      <Typography color=\"primary\" fontWeight={800} sx={{ maxWidth: 320 }} noWrap>
        {name}
      </Typography>
    </Breadcrumbs>
  );
}
