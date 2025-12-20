import { Box, type BoxProps, Container, type ContainerProps, useTheme } from "@mui/material";

type SectionBackground = "default" | "paper" | "muted";

export interface SectionProps extends Omit<BoxProps, "component"> {
  background?: SectionBackground;
  containerProps?: ContainerProps;
  disableContainer?: boolean;
  spacingY?: { xs?: number; md?: number };
}

export function Section({
  background = "default",
  containerProps,
  disableContainer = false,
  spacingY,
  children,
  sx,
  ...props
}: SectionProps) {
  const theme = useTheme();

  const backgroundColor =
    background === "paper"
      ? theme.palette.background.paper
      : background === "muted"
        ? theme.palette.background.default
        : undefined;

  const pyValues = {
    xs: spacingY?.xs ?? 10,
    md: spacingY?.md ?? 14,
  };

  const normalizedSx = Array.isArray(sx) ? sx : [sx].filter(Boolean);

  const content = disableContainer ? children : <Container maxWidth="lg" {...containerProps}>{children}</Container>;

  return (
    <Box component="section" sx={[{ backgroundColor, py: pyValues }, ...normalizedSx]} {...props}>
      {content}
    </Box>
  );
}
