import { createTheme } from "@mui/material/styles";
import type { Shadows } from "@mui/material/styles";
import { designSystemTokens } from "../../../tailwind.config";

const { colors, fontFamily, borderRadius, boxShadow } = designSystemTokens;

const customShadows: Shadows = [
  "none",
  boxShadow.soft,
  boxShadow.focus,
  boxShadow.strong,
  ...Array(21).fill(boxShadow.soft),
] as Shadows;

export const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: colors.brand[500],
      light: colors.brand[300],
      dark: colors.brand[700],
      contrastText: colors.neutral[50],
    },
    secondary: {
      main: colors.accent[500],
      light: colors.accent[300],
      dark: colors.accent[700],
      contrastText: colors.neutral[50],
    },
    background: {
      default: colors.neutral[50],
      paper: colors.neutral.white,
    },
    text: {
      primary: colors.neutral[800],
      secondary: colors.neutral[600],
    },
  },
  typography: {
    fontFamily: fontFamily.sans.join(", "),
    fontWeightBold: 800,
    h4: {
      fontWeight: 800,
    },
    h5: {
      fontWeight: 800,
    },
  },
  shape: {
    borderRadius: borderRadius.lg,
  },
  shadows: customShadows,
});
