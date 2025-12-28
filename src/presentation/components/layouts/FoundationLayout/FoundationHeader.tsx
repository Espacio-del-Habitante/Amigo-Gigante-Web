"use client";

import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import NotificationsNoneRoundedIcon from "@mui/icons-material/NotificationsNoneRounded";
import { AppBar, Avatar, Box, IconButton, Toolbar, Typography } from "@mui/material";
import { useTranslations } from "next-intl";

import { Logo } from "@/presentation/components/atoms";

export interface FoundationHeaderProps {
  onOpenMenu: () => void;
}

export function FoundationHeader({ onOpenMenu }: FoundationHeaderProps) {
  const t = useTranslations("dashboard");

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        backgroundColor: "background.paper",
        borderBottom: "1px solid",
        borderColor: "divider",
        color: "text.primary",
      }}
    >
      <Toolbar className="flex min-h-[72px] items-center gap-4 px-4 md:px-8">
        <Box className="flex flex-1 items-center gap-3 md:hidden">
          <IconButton aria-label={t("header.menu")} onClick={onOpenMenu}>
            <MenuRoundedIcon />
          </IconButton>
          <Box className="flex items-center gap-2">
            <Logo size={28} />
            <Typography variant="h6" sx={{ fontWeight: 800 }}>
              {t("brand.name")}
            </Typography>
          </Box>
        </Box>
        <Box className="hidden flex-1 md:block" />
        <Box className="flex items-center gap-4">
          <IconButton aria-label={t("header.notifications")}>
            <NotificationsNoneRoundedIcon />
          </IconButton>
          <Box className="flex items-center gap-3">
            <Box className="hidden text-right sm:block">
              <Typography variant="body2" sx={{ fontWeight: 700 }}>
                {t("header.user.name")}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {t("header.user.email")}
              </Typography>
            </Box>
            <Avatar sx={{ width: 40, height: 40, bgcolor: "primary.main" }}>
              {t("header.user.initials")}
            </Avatar>
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
