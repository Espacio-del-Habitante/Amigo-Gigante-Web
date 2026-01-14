import { NextIntlClientProvider } from "next-intl";
import { setRequestLocale } from "next-intl/server";

import type { ReactNode } from "react";
import { defaultLocale, locales } from "@/i18n/config";

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale: paramLocale } = await params;
  
  // Validar y usar el locale del params directamente
  const locale = locales.includes(paramLocale as (typeof locales)[number]) 
    ? paramLocale 
    : defaultLocale;
  
  // Establecer el locale para el contexto de la solicitud
  setRequestLocale(locale);
  
  // Cargar los mensajes directamente desde los archivos JSON usando el locale del params
  // Esto asegura que siempre usemos el locale correcto
  const [common, home, register, dashboard, login, profile, foundation, animals, adopt, shop] = await Promise.all([
    import(`@/messages/${locale}/common.json`),
    import(`@/messages/${locale}/home.json`),
    import(`@/messages/${locale}/register.json`),
    import(`@/messages/${locale}/dashboard.json`),
    import(`@/messages/${locale}/login.json`),
    import(`@/messages/${locale}/profile.json`),
    import(`@/messages/${locale}/foundation.json`),
    import(`@/messages/${locale}/animals.json`),
    import(`@/messages/${locale}/adopt.json`),
    import(`@/messages/${locale}/shop.json`),
  ]);

  const messages = {
    common: common.default,
    home: home.default,
    register: register.default,
    dashboard: dashboard.default,
    login: login.default,
    profile: profile.default,
    foundation: foundation.default,
    animals: animals.default,
    adopt: adopt.default,
    shop: shop.default,
  };

  // Debug: verificar que los mensajes se cargaron correctamente
  if (process.env.ENV === "development") {
    console.log(`[LocaleLayout] Locale: ${locale}, Param locale: ${paramLocale}`);
    console.log(`[LocaleLayout] Messages keys:`, Object.keys(messages));
    console.log(`[LocaleLayout] Sample home.hero.title:`, messages.home.hero?.title || "NOT FOUND");
  }

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      {children}
    </NextIntlClientProvider>
  );
}
