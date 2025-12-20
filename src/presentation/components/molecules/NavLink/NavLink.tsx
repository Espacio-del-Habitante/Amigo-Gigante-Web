import NextLink from "next/link";
import { Link as MuiLink, type LinkProps as MuiLinkProps, useTheme } from "@mui/material";

export interface NavLinkProps extends Omit<MuiLinkProps, "color" | "href"> {
  href?: string;
  label: string;
  active?: boolean;
}

export function NavLink({ href = "#", label, active = false, sx, ...props }: NavLinkProps) {
  const theme = useTheme();

  const baseStyles = {
    fontWeight: 700,
    color: active ? theme.palette.primary.main : theme.palette.text.secondary,
    display: "inline-flex",
    alignItems: "center",
    gap: 0.5,
    cursor: "pointer",
    textDecoration: "none",
    "&:hover": { color: theme.palette.primary.main },
    transition: "color 0.2s ease",
  };

  const normalizedSx = Array.isArray(sx) ? sx : [sx].filter(Boolean);

  return (
    <MuiLink component={NextLink} href={href} sx={[baseStyles, ...normalizedSx]} underline="none" {...props}>
      {label}
    </MuiLink>
  );
}
