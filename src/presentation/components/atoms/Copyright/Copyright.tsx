import { Typography } from "@mui/material";
import type { SxProps, Theme } from "@mui/material/styles";
import { useTranslations } from "next-intl";

export interface CopyrightProps {
  textAlign?: "left" | "center" | "right" | { xs?: "left" | "center" | "right"; sm?: "left" | "center" | "right"; md?: "left" | "center" | "right"; lg?: "left" | "center" | "right" };
  variant?: "body2" | "caption";
  sx?: SxProps<Theme>;
}

export function Copyright({ textAlign = "left", variant = "body2", sx }: CopyrightProps) {
  const t = useTranslations("common");
  const currentYear = new Date().getFullYear();

  return (
    <Typography variant={variant} color="text.secondary" sx={{ textAlign, ...sx }}>
      {t("footer.copyright", { year: currentYear })}
    </Typography>
  );
}
