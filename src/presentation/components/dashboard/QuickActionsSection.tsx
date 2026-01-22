"use client";

import AddCircleRoundedIcon from "@mui/icons-material/AddCircleRounded";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";

export function QuickActionsSection() {
  const t = useTranslations("dashboard");
  const locale = useLocale();
  const router = useRouter();

  const onNewAnimal = () => {
    router.push(`/${locale}/foundations/animals/add`);
  };

  return (
    <section className="rounded-xl border border-brand-100 bg-brand-50/30 p-6">
      <h3 className="mb-4 text-lg font-extrabold text-neutral-800">{t("quickActions.title")}</h3>
      <div className="flex flex-col gap-3">
        <button
          type="button"
          onClick={onNewAnimal}
          className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-brand-500 px-4 text-sm font-extrabold text-neutral-50 shadow-soft transition-colors hover:bg-brand-600 active:scale-[0.98]"
        >
          <AddCircleRoundedIcon fontSize="small" />
          <span>{t("quickActions.newAnimal")}</span>
        </button>
      </div>
    </section>
  );
}
