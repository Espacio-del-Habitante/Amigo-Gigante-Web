import { Typography } from "@mui/material";
import type { SxProps, Theme } from "@mui/material/styles";

export interface CopyrightProps {
  textAlign?: "left" | "center" | "right" | { xs?: "left" | "center" | "right"; sm?: "left" | "center" | "right"; md?: "left" | "center" | "right"; lg?: "left" | "center" | "right" };
  variant?: "body2" | "caption";
  sx?: SxProps<Theme>;
}

export function Copyright({ textAlign = "left", variant = "body2", sx }: CopyrightProps) {
  const currentYear = new Date().getFullYear();

  return (
    <Typography variant={variant} color="text.secondary" sx={{ textAlign, ...sx }}>
      © {currentYear} Amigo Gigante. Todos los derechos reservados.
    </Typography>
  );
}

