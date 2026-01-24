"use client";

import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import { IconButton, Tooltip, Typography } from "@mui/material";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";

import { Logo } from "@/presentation/components/atoms";

export interface AccountSidebarProps {
  profileName: string;
  activeRoute?: "account" | "adoptions";
}

export function AccountSidebar({ profileName, activeRoute = "account" }: AccountSidebarProps) {
  const t = useTranslations("account");
  const common = useTranslations("common");
  const locale = useLocale();

  const displayInitial = profileName.trim().slice(0, 1).toUpperCase() || "?";

  return (
    <aside className="hidden w-72 flex-col border-r border-neutral-200 bg-white px-6 py-8 md:flex">
      <div className="mb-8 flex items-center justify-between gap-3">
        <Logo size={40} showWordmark direction="row" />
        <Tooltip title={common("labels.backToHome")} arrow>
          <IconButton
            component={Link}
            href={`/${locale}`}
            size="small"
            className="text-neutral-600 hover:bg-neutral-100 hover:text-brand-600"
            aria-label={common("labels.backToHomeAria")}
          >
            <ArrowBackRoundedIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </div>
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-neutral-200 text-lg font-semibold text-neutral-700">
          {displayInitial}
        </div>
        <div className="min-w-0">
          <Typography variant="subtitle2" className="truncate font-semibold text-neutral-900">
            {profileName || t("sidebar.fallbackName")}
          </Typography>
          <Typography variant="caption" className="text-neutral-500">
            {t("sidebar.subtitle")}
          </Typography>
        </div>
      </div>
      <nav className="flex flex-col gap-2">
        <Link
          href={`/${locale}/account`}
          className={`flex items-center gap-3 rounded-lg px-3 py-2 ${
            activeRoute === "account"
              ? "bg-brand-50 text-brand-600"
              : "text-neutral-500 hover:bg-neutral-50 hover:text-neutral-700"
          }`}
        >
          <span className="material-symbols-outlined">person</span>
          <span className={`text-sm ${activeRoute === "account" ? "font-semibold" : "font-medium"}`}>
            {t("sidebar.account")}
          </span>
        </Link>
        <Link
          href={`/${locale}/account/adoptions`}
          className={`flex items-center gap-3 rounded-lg px-3 py-2 ${
            activeRoute === "adoptions"
              ? "bg-brand-50 text-brand-600"
              : "text-neutral-500 hover:bg-neutral-50 hover:text-neutral-700"
          }`}
        >
          <span className="material-symbols-outlined">pets</span>
          <span className={`text-sm ${activeRoute === "adoptions" ? "font-semibold" : "font-medium"}`}>
            {t("sidebar.requests")}
          </span>
        </Link>
      </nav>
    </aside>
  );
}
