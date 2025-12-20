import { alpha, Button as MuiButton, type ButtonProps as MuiButtonProps, useTheme } from "@mui/material";

import { designSystemTokens } from "@/../tailwind.config";

type ButtonTone = "primary" | "secondary" | "neutral";
type ButtonVariant = "solid" | "outlined" | "ghost";

export interface ButtonProps extends Omit<MuiButtonProps, "color" | "variant"> {
  tone?: ButtonTone;
  variant?: ButtonVariant;
  rounded?: "pill" | "default";
}

export function Button({ tone = "primary", variant = "solid", rounded = "pill", sx, ...props }: ButtonProps) {
  const theme = useTheme();

  const paletteByTone = {
    primary: {
      main: theme.palette.primary.main,
      light: theme.palette.primary.light,
      dark: theme.palette.primary.dark,
      contrastText: theme.palette.primary.contrastText,
    },
    secondary: {
      main: theme.palette.secondary.main,
      light: theme.palette.secondary.light,
      dark: theme.palette.secondary.dark,
      contrastText: theme.palette.secondary.contrastText,
    },
    neutral: {
      main: designSystemTokens.colors.neutral[700],
      light: designSystemTokens.colors.neutral[100],
      dark: designSystemTokens.colors.neutral[800],
      contrastText: designSystemTokens.colors.neutral.white,
    },
  } as const;

  const palette = paletteByTone[tone];

  const variantStyles: Record<ButtonVariant, object> = {
    solid: {
      backgroundColor: palette.main,
      color: palette.contrastText,
      boxShadow: theme.shadows[2],
      "&:hover": {
        backgroundColor: palette.dark,
        boxShadow: theme.shadows[3],
      },
      "&:focus-visible": {
        boxShadow: `${theme.shadows[1]}, 0 0 0 4px ${alpha(palette.main, 0.2)}`,
      },
    },
    outlined: {
      backgroundColor: theme.palette.background.paper,
      color: palette.main,
      borderColor: palette.main,
      "&:hover": {
        backgroundColor: alpha(palette.main, 0.06),
        borderColor: palette.dark,
      },
      "&:focus-visible": {
        boxShadow: `${theme.shadows[1]}, 0 0 0 4px ${alpha(palette.main, 0.18)}`,
      },
    },
    ghost: {
      backgroundColor: alpha(palette.main, 0.08),
      color: palette.main,
      boxShadow: "none",
      "&:hover": {
        backgroundColor: alpha(palette.main, 0.14),
      },
    },
  };

  const baseStyles = {
    borderRadius: rounded === "pill" ? 999 : theme.shape.borderRadius,
    fontWeight: 800,
    textTransform: "none" as const,
    px: 3,
  };

  const normalizedSx = Array.isArray(sx) ? sx : [sx].filter(Boolean);

  return <MuiButton {...props} sx={[baseStyles, variantStyles[variant], ...normalizedSx]} />;
}
