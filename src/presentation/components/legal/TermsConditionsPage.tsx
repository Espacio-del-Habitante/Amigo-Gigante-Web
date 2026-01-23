"use client";

import { useTranslations } from "next-intl";

import { LegalContent, LegalSection } from "@/presentation/components/legal/LegalContent";

const toArray = (value: unknown): string[] => (Array.isArray(value) ? value : []);

export function TermsConditionsPage() {
  const t = useTranslations("legal");

  return (
    <LegalContent
      title={t("terms.title")}
      updatedAtLabel={t("terms.updatedAtLabel")}
      updatedAtDate={t("terms.updatedAtDate")}
      intro={t("terms.intro")}
    >
      <LegalSection
        title={t("terms.sections.acceptance.title")}
        body={t("terms.sections.acceptance.body")}
      />
      <LegalSection
        title={t("terms.sections.service.title")}
        body={t("terms.sections.service.body")}
      />
      <LegalSection
        title={t("terms.sections.registration.title")}
        items={toArray(t.raw("terms.sections.registration.items"))}
      />
      <LegalSection
        title={t("terms.sections.permittedUse.title")}
        items={toArray(t.raw("terms.sections.permittedUse.items"))}
      />
      <LegalSection
        title={t("terms.sections.prohibitions.title")}
        items={toArray(t.raw("terms.sections.prohibitions.items"))}
      />
      <LegalSection
        title={t("terms.sections.intellectualProperty.title")}
        body={t("terms.sections.intellectualProperty.body")}
      />
      <LegalSection
        title={t("terms.sections.liability.title")}
        body={t("terms.sections.liability.body")}
      />
      <LegalSection
        title={t("terms.sections.indemnification.title")}
        body={t("terms.sections.indemnification.body")}
      />
      <LegalSection
        title={t("terms.sections.changes.title")}
        body={t("terms.sections.changes.body")}
      />
      <LegalSection
        title={t("terms.sections.termination.title")}
        body={t("terms.sections.termination.body")}
      />
      <LegalSection
        title={t("terms.sections.jurisdiction.title")}
        body={t("terms.sections.jurisdiction.body")}
      />
      <LegalSection
        title={t("terms.sections.contact.title")}
        body={t("terms.sections.contact.body")}
      />
    </LegalContent>
  );
}
