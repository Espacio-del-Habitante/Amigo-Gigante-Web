import { Button, Typography } from "@mui/material";
import type { useTranslations } from "next-intl";

interface AccountDeleteSectionProps {
  t: ReturnType<typeof useTranslations>;
  onDelete: () => void;
  isLoading: boolean;
}

export function AccountDeleteSection({ t, onDelete, isLoading }: AccountDeleteSectionProps) {
  return (
    <section className="mt-10 rounded-xl border border-red-100 bg-red-50 p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <Typography variant="subtitle1" className="font-bold text-red-800">
            {t("danger.title")}
          </Typography>
          <Typography variant="body2" className="text-red-600">
            {t("danger.description")}
          </Typography>
        </div>
        <Button
          variant="contained"
          className="bg-red-600 text-white hover:bg-red-700"
          disabled={isLoading}
          onClick={onDelete}
        >
          {t("danger.button")}
        </Button>
      </div>
    </section>
  );
}
