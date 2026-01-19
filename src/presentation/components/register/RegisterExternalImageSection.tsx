import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";
import { alpha, Box, Stack, Typography, useTheme } from "@mui/material";
import Image from "next/image";
import { useTranslations } from "next-intl";

const HERO_IMAGE =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCARsB1DK19DNtMD40nIQ1m5kS3fBSk4-EPX17NCkOEoc9p838f593n5-u5QoD0e7YmZgSG4vG5JMzbosU8RVXJV_NhFgkwBPpHyOhi6HZIDcNCkTYDI5Lc-v2H9-daYXvNBJEHjA1PWzMV_0IsIq3xbksENXAXsmAHyA05wCih-CxjPoveIUF8J9gI7_ZQC1QzL9ivN6Mbei2xOHyR5b-K1jWxUJG_6P-bU2a6QEDxNXpXiBvp40bm_hxbCgN5CW8EOskAjYhtrQ";

const AVATAR_IMAGES = [
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBafYrCbXrBLHJzB_t-CEWIJ6e8wLGEdKWXf-J9s5wDSwq57R9dTdQwFMLagsB-nLAOIc69zgP5MRYj9p0JphueDrLiNaGpBb6XC_HPJz_3s2WoKyiLnJAtdQixNcH_0JvCCxNmQZ2MTlOOICjorV9USUG6S1-eas6j484caLEw39_Qug3x8PgLac5ojWEA7XjfIp6xwkEDtklPX1jks8J5anc0mBu9IeJZahI1lsH7y3wJdVwW6q-lACNQiTUgRjsUfoR-KGzqTQ",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDenIWs2gGGUlKmoRTzCXElzgxhGSV2baN3AUAehjLNPb-nj4owaxne_4_rT6g41bobC2eoG8S3HgosE4wvWswOGJxL91APykLrDMAh7zElMixTCrrEmiYeBQEIfTxe_DTjUkG4DwviXEgu-YJn44816w3U-6F0apIEfhVQtrPiX44aCI9l_6yHRW_Jpl2i69j2SZ47nEd2m0820T-yHXLIhQwLRQcoVHk_fydZPbGtB4Vq23CKLgINvJwBBka23uJDIBZSG2NgEw",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDjwqnJEWYWFRu3TxZniEkdY75p1xWdaftUgGurg3UKO8IGY9Be6FD39FBdyxeO-BaDxeWMILJ2iX_Gn9PxhyRocqGinjOtUVZqzqY_h5gCWjsM6kb2JriCTkdAiLQ9aoLdlEzhDxECsckq0RuOrSSxOheWkPQn7HUre9ckEvnUJwdwG6MBF0aEDBTpHeBw1TClYJXLhysS8UimOAZWcROcFkpVCb7oi9bHADKafdPE-iZEBBkvWNgHQgaZ86KiEYaBg7FV_54TfQ",
];

export function RegisterExternalImageSection() {
  const theme = useTheme();
  const t = useTranslations("register");

  return (
    <Box
      className="relative hidden overflow-hidden rounded-2xl bg-neutral-900 lg:flex"
      sx={{
        boxShadow: theme.shadows[3],
        minHeight: { lg: 680 },
      }}
    >
      <Image
        src={HERO_IMAGE}
        alt={t("external.image.alt")}
        fill
        priority
        style={{ objectFit: "cover" }}
        sizes="(min-width: 1536px) 720px, (min-width: 1280px) 640px, (min-width: 1024px) 560px, 0px"
      />
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          background: `linear-gradient(180deg, ${alpha(theme.palette.common.black, 0.15)} 0%, ${alpha(
            theme.palette.common.black,
            0.7,
          )} 100%)`,
        }}
      />
      <Stack
        spacing={3}
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
            backgroundColor: alpha(theme.palette.common.white, 0.2),
            border: "1px solid",
            borderColor: alpha(theme.palette.common.white, 0.2),
            backdropFilter: "blur(6px)",
            px: 2.5,
            py: 1,
            borderRadius: 999,
            boxShadow: theme.shadows[2],
          }}
        >
          <FavoriteRoundedIcon fontSize="small" />
          <Typography variant="body2" sx={{ fontWeight: 700 }}>
            {t("external.image.badge")}
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
            {t("external.image.quote")}
          </Typography>
          <Typography variant="body1" sx={{ opacity: 0.85 }}>
            {t("external.image.attribution")}
          </Typography>
        </Stack>
        <Stack direction="row" alignItems="center" spacing={2.5}>
          <Stack direction="row" alignItems="center" sx={{ ml: 0.5 }}>
            {AVATAR_IMAGES.map((avatar, index) => (
              <Box
                key={avatar}
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  border: "2px solid",
                  borderColor: theme.palette.common.white,
                  overflow: "hidden",
                  ml: index === 0 ? 0 : -1.5,
                }}
              >
                <Image src={avatar} alt={t("external.image.avatarAlt")} width={40} height={40} />
              </Box>
            ))}
          </Stack>
          <Stack spacing={0} sx={{ color: alpha(theme.palette.common.white, 0.9) }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
              {t("external.image.statsValue")}
            </Typography>
            <Typography variant="body2">{t("external.image.statsLabel")}</Typography>
          </Stack>
        </Stack>
      </Stack>
    </Box>
  );
}
