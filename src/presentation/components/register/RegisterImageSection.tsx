import { alpha, Box, Stack, Typography, useTheme } from "@mui/material";
import Image from "next/image";

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1507146426996-ef05306b995a?auto=format&fit=crop&w=1600&q=80";

export function RegisterImageSection() {
  const theme = useTheme();

  return (
    <Box
      className="relative hidden overflow-hidden rounded-2xl bg-neutral-900 lg:flex"
      sx={{
        boxShadow: theme.shadows[3],
        minHeight: { lg: 640 },
      }}
    >
      <Image
        src={HERO_IMAGE}
        alt="Dogs enjoying the outdoors"
        fill
        priority
        style={{ objectFit: "cover" }}
        sizes="(min-width: 1024px) 600px, 0px"
      />
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          background: `linear-gradient(180deg, ${alpha(theme.palette.common.black, 0.25)} 0%, ${alpha(theme.palette.common.black, 0.65)} 100%)`,
        }}
      />
      <Stack
        spacing={2.5}
        sx={{
          position: "absolute",
          inset: 0,
          p: { lg: 4, xl: 6 },
          justifyContent: "flex-end",
          color: "common.white",
        }}
      >
        <Stack
          direction="row"
          alignItems="center"
          spacing={1.5}
          sx={{
            alignSelf: "flex-start",
            backgroundColor: alpha(theme.palette.primary.main, 0.18),
            border: "1px solid",
            borderColor: alpha(theme.palette.primary.main, 0.4),
            backdropFilter: "blur(6px)",
            px: 2.5,
            py: 1,
            borderRadius: 999,
            boxShadow: theme.shadows[2],
          }}
        >
          <Box
            sx={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              backgroundColor: theme.palette.secondary.main,
              boxShadow: `0 0 0 6px ${alpha(theme.palette.secondary.main, 0.2)}`,
            }}
          />
          <Typography variant="body2" sx={{ fontWeight: 700 }}>
            Join 500+ Foundations
          </Typography>
        </Stack>
        <Stack spacing={1}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 800,
              lineHeight: 1.2,
              textShadow: "0 10px 30px rgba(0,0,0,0.25)",
            }}
          >
            “Since joining, we have connected with hundreds of volunteers and adopters in record time.”
          </Typography>
          <Typography variant="body1" sx={{ opacity: 0.85 }}>
            Fundación Caminos Caninos
          </Typography>
        </Stack>
      </Stack>
    </Box>
  );
}
