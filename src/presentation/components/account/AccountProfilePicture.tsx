import { Avatar, Typography } from "@mui/material";
import type { useTranslations } from "next-intl";

interface AccountProfilePictureProps {
  t: ReturnType<typeof useTranslations>;
  displayName: string;
}

export function AccountProfilePicture({
  t,
  displayName,
}: AccountProfilePictureProps) {
  const initials = displayName
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");

  return (
    <section className="rounded-xl border border-neutral-200 bg-white p-6">
      <div className="mb-6 flex items-center gap-2">
        <span className="material-symbols-outlined text-brand-500">account_circle</span>
        <Typography variant="h6" className="font-bold text-neutral-900">
          {t("sections.profilePhoto")}
        </Typography>
      </div>
      <div className="flex flex-col gap-6 md:flex-row md:items-center">
        <div className="relative">
          <Avatar
            alt={displayName}
            className="h-24 w-24 border-4 border-white bg-neutral-200 text-2xl font-semibold text-neutral-700 shadow-sm"
          >
            {initials || "?"}
          </Avatar>
        </div>
        <div className="flex flex-col gap-2">
          <Typography variant="body2" className="text-neutral-600">
            {t("photo.description")}
          </Typography>
        </div>
      </div>
    </section>
  );
}
