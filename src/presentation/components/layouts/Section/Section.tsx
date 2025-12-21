import { Box, type BoxProps, Container, type ContainerProps, type SxProps, type Theme, useTheme } from "@mui/material";

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

  const { maxWidth = "lg", sx: containerSx, ...restContainerProps } = containerProps ?? {};
  const normalizedSx = Array.isArray(sx) ? sx : [sx].filter(Boolean);
  const normalizedContainerSx = Array.isArray(containerSx) ? containerSx : [containerSx].filter(Boolean);

  const content = disableContainer ? (
    children
  ) : (
    <Container
      maxWidth={maxWidth}
      sx={[{ maxWidth: 1440, px: { xs: 3, sm: 4 }, width: "100%" }, ...normalizedContainerSx].filter(Boolean) as SxProps<Theme>}
      {...restContainerProps}
    >
      {children}
    </Container>
  );

  return (
    <Box component="section" sx={[{ backgroundColor, py: pyValues }, ...normalizedSx]} {...props}>
      {content}
    </Box>
  );
}
