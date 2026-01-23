import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import { Box, Container, IconButton, Stack, Typography } from "@mui/material";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";

interface AnnouncementSlide {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
}

interface AnnouncementsCarouselProps {
  autoPlayMs?: number;
}

export function AnnouncementsCarousel({ autoPlayMs = 6000 }: AnnouncementsCarouselProps) {
  const t = useTranslations("home");
  const slides = useMemo<AnnouncementSlide[]>(
    () => [
      {
        id: "adoption",
        title: t("announcements.items.adoption.title"),
        description: t("announcements.items.adoption.description"),
        imageUrl:
          "https://images.unsplash.com/photo-1517423440428-a5a00ad493e8?auto=format&fit=crop&w=900&q=80",
      },
      {
        id: "volunteering",
        title: t("announcements.items.volunteering.title"),
        description: t("announcements.items.volunteering.description"),
        imageUrl:
          "https://images.unsplash.com/photo-1450778869180-41d0601e046e?auto=format&fit=crop&w=900&q=80",
      },
      {
        id: "store",
        title: t("announcements.items.store.title"),
        description: t("announcements.items.store.description"),
        imageUrl:
          "https://images.unsplash.com/photo-1507146426996-ef05306b995a?auto=format&fit=crop&w=900&q=80",
      },
    ],
    [t],
  );

  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (!autoPlayMs) return;

    const interval = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % slides.length);
    }, autoPlayMs);

    return () => window.clearInterval(interval);
  }, [autoPlayMs, slides.length]);

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % slides.length);
  };

  const activeSlide = slides[activeIndex];

  return (
    <Box component="section" className="bg-white py-12 md:py-16">
      <Container maxWidth="xl" sx={{ maxWidth: 1440, px: { xs: 3, sm: 4 } }}>
        <Box
          className="relative overflow-hidden rounded-[32px] px-6 py-8 md:px-10 md:py-12"
          sx={(theme) => ({
            background: `linear-gradient(90deg, ${theme.palette.secondary.main}, ${theme.palette.primary.main})`,
            color: theme.palette.common.white,
            boxShadow: theme.shadows[3],
          })}
        >
          <Box
            sx={{
              position: "absolute",
              right: -60,
              top: -80,
              width: 240,
              height: 240,
              backgroundColor: "rgba(255,255,255,0.12)",
              filter: "blur(60px)",
              borderRadius: "50%",
            }}
          />
          <Stack
            direction={{ xs: "column", md: "row" }}
            alignItems="center"
            justifyContent="space-between"
            className="relative flex-col gap-6 md:flex-row"
          >
            <Stack className="gap-3" sx={{ maxWidth: 620 }}>
              <Typography variant="overline" sx={{ fontWeight: 800, letterSpacing: 1 }}>
                {t("announcements.badge")}
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 800 }}>
                {activeSlide.title}
              </Typography>
              <Typography variant="body1" sx={{ color: "rgba(255,255,255,0.85)", lineHeight: 1.7 }}>
                {activeSlide.description}
              </Typography>
              <Stack direction="row" spacing={1} alignItems="center">
                {slides.map((slide, index) => (
                  <Box
                    key={slide.id}
                    onClick={() => setActiveIndex(index)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        setActiveIndex(index);
                      }
                    }}
                    aria-label={t("announcements.indicatorAria", { index: index + 1 })}
                    sx={{
                      width: index === activeIndex ? 20 : 8,
                      height: 8,
                      borderRadius: 999,
                      backgroundColor: index === activeIndex ? "common.white" : "rgba(255,255,255,0.45)",
                      transition: "all 0.2s ease",
                      cursor: "pointer",
                    }}
                  />
                ))}
              </Stack>
            </Stack>
            <Box sx={{ position: "relative", width: { xs: "100%", md: 320 }, height: 220 }}>
              <Image
                src={activeSlide.imageUrl}
                alt={activeSlide.title}
                fill
                style={{ objectFit: "cover", borderRadius: 24 }}
                sizes="(max-width: 900px) 100vw, 320px"
              />
            </Box>
          </Stack>
          <Stack direction="row" spacing={1.5} className="relative mt-6 justify-end">
            <IconButton
              onClick={handlePrev}
              aria-label={t("announcements.prev")}
              sx={{
                backgroundColor: "rgba(255,255,255,0.18)",
                color: "common.white",
                "&:hover": { backgroundColor: "rgba(255,255,255,0.28)" },
              }}
            >
              <ArrowBackRoundedIcon />
            </IconButton>
            <IconButton
              onClick={handleNext}
              aria-label={t("announcements.next")}
              sx={{
                backgroundColor: "rgba(255,255,255,0.18)",
                color: "common.white",
                "&:hover": { backgroundColor: "rgba(255,255,255,0.28)" },
              }}
            >
              <ArrowForwardRoundedIcon />
            </IconButton>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
}
