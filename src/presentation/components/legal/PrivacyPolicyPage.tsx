"use client";

import { useTranslations } from "next-intl";

import { LegalContent, LegalSection } from "@/presentation/components/legal/LegalContent";

const toArray = (value: unknown): string[] => (Array.isArray(value) ? value : []);

export function PrivacyPolicyPage() {
  const t = useTranslations("legal");

  return (
    <LegalContent
      title={t("privacy.title")}
      updatedAtLabel={t("privacy.updatedAtLabel")}
      updatedAtDate={t("privacy.updatedAtDate")}
      intro={t("privacy.intro")}
    >
      <LegalSection
        title={t("privacy.sections.responsible.title")}
        items={toArray(t.raw("privacy.sections.responsible.items"))}
      />
      <LegalSection
        title={t("privacy.sections.dataCollected.title")}
        intro={t("privacy.sections.dataCollected.intro")}
        items={toArray(t.raw("privacy.sections.dataCollected.items"))}
      />
      <LegalSection
        title={t("privacy.sections.purpose.title")}
        items={toArray(t.raw("privacy.sections.purpose.items"))}
      />
      <LegalSection
        title={t("privacy.sections.legalBasis.title")}
        items={toArray(t.raw("privacy.sections.legalBasis.items"))}
      />
      <LegalSection
        title={t("privacy.sections.foundationSharing.title")}
        intro={t("privacy.sections.foundationSharing.intro")}
        items={toArray(t.raw("privacy.sections.foundationSharing.items"))}
        highlight={t("privacy.sections.foundationSharing.rights")}
      />
      <LegalSection
        title={t("privacy.sections.transfers.title")}
        body={t("privacy.sections.transfers.body")}
      />
      <LegalSection
        title={t("privacy.sections.security.title")}
        items={toArray(t.raw("privacy.sections.security.items"))}
      />
      <LegalSection
        title={t("privacy.sections.rights.title")}
        intro={t("privacy.sections.rights.intro")}
        items={toArray(t.raw("privacy.sections.rights.items"))}
        highlight={t("privacy.sections.rights.howTo")}
      />
      <LegalSection
        title={t("privacy.sections.retention.title")}
        body={t("privacy.sections.retention.body")}
      />
      <LegalSection
        title={t("privacy.sections.changes.title")}
        body={t("privacy.sections.changes.body")}
      />
      <LegalSection
        title={t("privacy.sections.contact.title")}
        body={t("privacy.sections.contact.body")}
      />
      <LegalSection
        title={t("privacy.sections.legalReferences.title")}
        items={toArray(t.raw("privacy.sections.legalReferences.items"))}
      />
    </LegalContent>
  );
}
