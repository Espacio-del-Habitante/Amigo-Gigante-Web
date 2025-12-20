import type { Config } from "tailwindcss";

export const designSystemTokens = {
  colors: {
    brand: {
      50: "#e0f5ff",
      100: "#b3e6ff",
      200: "#80d7ff",
      300: "#4dc7ff",
      400: "#26b6ff",
      500: "#1cb0f6",
      600: "#158dd5",
      700: "#0f6ab3",
      800: "#094a82",
      900: "#043152",
      DEFAULT: "#1cb0f6",
    },
    accent: {
      50: "#fff2e6",
      100: "#ffd9b8",
      200: "#ffbf89",
      300: "#ffa55a",
      400: "#ff8c2c",
      500: "#f97316",
      600: "#dd5b0f",
      700: "#b54109",
      800: "#8c2b07",
      900: "#5c1b03",
      DEFAULT: "#f97316",
    },
    neutral: {
      50: "#f8fafc",
      100: "#e2e8f0",
      200: "#cbd5e1",
      300: "#94a3b8",
      400: "#64748b",
      500: "#475569",
      600: "#334155",
      700: "#1e293b",
      800: "#0f172a",
      900: "#0b1220",
      white: "#ffffff",
      black: "#0b1220",
    },
  },
  fontFamily: {
    sans: ["Poppins", "Arial", "sans-serif"],
  },
  borderRadius: {
    none: 0,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    full: 9999,
  },
  boxShadow: {
    soft: "0 10px 25px -10px rgba(15, 23, 42, 0.25)",
    focus: "0 0 0 4px rgba(28, 176, 246, 0.25)",
    strong: "0 25px 50px -12px rgba(15, 23, 42, 0.35)",
  },
};

const tailwindBorderRadius = Object.fromEntries(
  Object.entries(designSystemTokens.borderRadius).map(([key, value]) => [key, `${value}px`]),
);

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/presentation/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: designSystemTokens.colors.brand,
        accent: designSystemTokens.colors.accent,
        neutral: designSystemTokens.colors.neutral,
      },
      fontFamily: designSystemTokens.fontFamily,
      borderRadius: tailwindBorderRadius,
      boxShadow: designSystemTokens.boxShadow,
    },
  },
  plugins: [],
};

export default config;
