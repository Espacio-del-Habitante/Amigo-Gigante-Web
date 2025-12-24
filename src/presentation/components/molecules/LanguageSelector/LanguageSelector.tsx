"use client";

import { MenuItem, TextField, type TextFieldProps } from "@mui/material";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";

import { locales } from "@/i18n/config";

export interface LanguageSelectorProps
  extends Omit<TextFieldProps, "select" | "value" | "onChange" | "defaultValue"> {}

export function LanguageSelector({ size = "small", ...props }: LanguageSelectorProps) {
  const t = useTranslations("common");
  const locale = useLocale();
  const router = useRouter();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const nextLocale = event.target.value;

    document.cookie = `NEXT_LOCALE=${nextLocale};path=/;max-age=31536000`;
    window.localStorage.setItem("locale", nextLocale);
    router.refresh();
  };

  return (
    <TextField
      select
      size={size}
      label={t("labels.language")}
      value={locale}
      onChange={handleChange}
      {...props}
    >
      {locales.map((localeOption) => (
        <MenuItem key={localeOption} value={localeOption}>
          {localeOption === "es" ? t("labels.spanish") : t("labels.english")}
        </MenuItem>
      ))}
    </TextField>
  );
}
