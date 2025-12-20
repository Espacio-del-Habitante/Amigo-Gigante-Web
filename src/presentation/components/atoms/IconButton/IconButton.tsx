import { alpha, IconButton as MuiIconButton, type IconButtonProps as MuiIconButtonProps, useTheme } from "@mui/material";

import { designSystemTokens } from "@/../tailwind.config";

type IconButtonTone = "primary" | "secondary" | "neutral";
type IconButtonVariant = "ghost" | "filled";

export interface IconButtonProps extends MuiIconButtonProps {
  tone?: IconButtonTone;
  variant?: IconButtonVariant;
}

export function IconButton({ tone = "neutral", variant = "ghost", sx, ...props }: IconButtonProps) {
  const theme = useTheme();

  const paletteByTone = {
    primary: theme.palette.primary,
    secondary: theme.palette.secondary,
    neutral: {
      main: designSystemTokens.colors.neutral[600],
      light: designSystemTokens.colors.neutral[100],
      dark: designSystemTokens.colors.neutral[800],
    },
  } as const;

  const palette = paletteByTone[tone];

  const variantStyles: Record<IconButtonVariant, object> = {
    ghost: {
      backgroundColor: alpha(palette.main, 0.08),
      color: palette.main,
      "&:hover": {
        backgroundColor: alpha(palette.main, 0.16),
      },
    },
    filled: {
      backgroundColor: palette.main,
      color: designSystemTokens.colors.neutral.white,
      "&:hover": {
        backgroundColor: palette.dark ?? palette.main,
      },
    },
  };

  const baseStyles = {
    borderRadius: 999,
  };

  const normalizedSx = Array.isArray(sx) ? sx : [sx].filter(Boolean);

  return <MuiIconButton {...props} sx={[baseStyles, variantStyles[variant], ...normalizedSx]} />;
}
