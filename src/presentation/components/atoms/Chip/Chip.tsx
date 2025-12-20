import { alpha, Chip as MuiChip, type ChipProps as MuiChipProps, useTheme } from "@mui/material";

import { designSystemTokens } from "@/../tailwind.config";

type ChipTone = "brand" | "accent" | "neutral";
type ChipVariant = "solid" | "soft";

export interface ChipProps extends Omit<MuiChipProps, "color" | "variant"> {
  tone?: ChipTone;
  variant?: ChipVariant;
}

export function Chip({ tone = "brand", variant = "soft", sx, ...props }: ChipProps) {
  const theme = useTheme();

  const tonePalette = {
    brand: {
      main: theme.palette.primary.main,
      light: theme.palette.primary.light,
      contrastText: theme.palette.primary.contrastText,
    },
    accent: {
      main: theme.palette.secondary.main,
      light: theme.palette.secondary.light,
      contrastText: theme.palette.secondary.contrastText,
    },
    neutral: {
      main: designSystemTokens.colors.neutral[600],
      light: designSystemTokens.colors.neutral[100],
      contrastText: designSystemTokens.colors.neutral.white,
    },
  } as const;

  const palette = tonePalette[tone];

  const variantStyles: Record<ChipVariant, object> = {
    solid: {
      backgroundColor: palette.main,
      color: palette.contrastText,
    },
    soft: {
      backgroundColor: alpha(palette.main, 0.12),
      color: palette.main,
    },
  };

  const baseStyles = {
    borderRadius: 999,
    fontWeight: 700,
  };

  const normalizedSx = Array.isArray(sx) ? sx : [sx].filter(Boolean);

  return <MuiChip {...props} sx={[baseStyles, variantStyles[variant], ...normalizedSx]} />;
}
