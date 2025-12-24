"use client";

import { MenuItem, TextField, type TextFieldProps } from "@mui/material";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { defaultLocale, locales } from "@/i18n/config";

export interface LanguageSelectorProps
  extends Omit<TextFieldProps, "select" | "value" | "onChange" | "defaultValue"> {}

export function LanguageSelector({ size = "small", ...props }: LanguageSelectorProps) {
  const t = useTranslations("common");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Con localePrefix: "always", TODAS las rutas incluyen el locale
  // Ejemplo: /en/register, /es/register, /en, /es
  const removeLocalePrefix = (path: string) => {
    for (const localeOption of locales) {
      // Si el path es exactamente /locale (ej: /en o /es)
      if (path === `/${localeOption}`) {
        return "/";
      }
      // Si el path empieza con /locale/ (ej: /en/register)
      if (path.startsWith(`/${localeOption}/`)) {
        return path.replace(`/${localeOption}`, "");
      }
    }
    // Si no tiene prefijo de locale, devolver tal cual
    return path;
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const nextLocale = event.target.value;

    // Guardar preferencia del usuario
    document.cookie = `NEXT_LOCALE=${nextLocale};path=/;max-age=31536000;samesite=lax`;
    window.localStorage.setItem("locale", nextLocale);

    // Remover el locale actual del pathname
    // Ejemplo: /en/register -> /register, /es -> /
    const normalizedPathname = removeLocalePrefix(pathname);
    
    // Construir la nueva ruta con el nuevo locale
    // Con localePrefix: "always", TODAS las rutas deben incluir el locale
    const targetPath = `/${nextLocale}${normalizedPathname === "/" ? "" : normalizedPathname}`;
    
    // Preservar query params si existen
    const queryString = searchParams.toString();
    const url = queryString ? `${targetPath}?${queryString}` : targetPath;

    router.replace(url);
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
