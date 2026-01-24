"use client";

import { useTranslations } from "next-intl";

import { LegalContent, LegalSection } from "@/presentation/components/legal/LegalContent";

const toArray = (value: unknown): string[] => (Array.isArray(value) ? value : []);

export function CookiesPolicyPage() {
  const t = useTranslations("legal");

  return (
    <LegalContent
      title={t("cookies.title")}
      updatedAtLabel={t("cookies.updatedAtLabel")}
      updatedAtDate={t("cookies.updatedAtDate")}
      intro={t("cookies.intro")}
    >
      <LegalSection
        title={t("cookies.sections.definition.title")}
        body={t("cookies.sections.definition.body")}
      />
      <LegalSection
        title={t("cookies.sections.types.title")}
        items={toArray(t.raw("cookies.sections.types.items"))}
      />
      <LegalSection
        title={t("cookies.sections.purposes.title")}
        items={toArray(t.raw("cookies.sections.purposes.items"))}
      />
      <LegalSection
        title={t("cookies.sections.thirdParties.title")}
        body={t("cookies.sections.thirdParties.body")}
      />
      <LegalSection
        title={t("cookies.sections.consent.title")}
        body={t("cookies.sections.consent.body")}
      />
      <LegalSection
        title={t("cookies.sections.manage.title")}
        items={toArray(t.raw("cookies.sections.manage.items"))}
      />
      <LegalSection
        title={t("cookies.sections.changes.title")}
        body={t("cookies.sections.changes.body")}
      />
      <LegalSection
        title={t("cookies.sections.contact.title")}
        body={t("cookies.sections.contact.body")}
      />
    </LegalContent>
  );
}
