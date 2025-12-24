import type { Metadata } from "next";
import { getLocale } from "next-intl/server";

import "./globals.css";
import { MuiProvider } from "../presentation/providers/MuiProvider";

export const metadata: Metadata = {
  title: "Amigo Gigante",
  description: "Plataforma de adopción y apadrinamiento de animales",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();

  return (
    <html lang={locale}>
      <body>
        <MuiProvider>{children}</MuiProvider>
      </body>
    </html>
  );
}
