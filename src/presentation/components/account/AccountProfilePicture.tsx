import { Avatar, Button, Typography } from "@mui/material";
import type { useTranslations } from "next-intl";
import { useRef } from "react";

interface AccountProfilePictureProps {
  t: ReturnType<typeof useTranslations>;
  displayName: string;
  avatarUrl: string | null;
  isLoading: boolean;
  errorMessage?: string | null;
  onSelect: (file: File) => void;
  onRemove: () => void;
}

export function AccountProfilePicture({
  t,
  displayName,
  avatarUrl,
  isLoading,
  errorMessage,
  onSelect,
  onRemove,
}: AccountProfilePictureProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onSelect(file);
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

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
            src={avatarUrl ?? undefined}
            alt={displayName}
            className="h-24 w-24 border-4 border-white shadow-sm"
          />
        </div>
        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap gap-3">
            <Button
              variant="contained"
              className="bg-brand-500 text-white hover:bg-brand-600"
              disabled={isLoading}
              onClick={() => fileInputRef.current?.click()}
            >
              {t("photo.upload")}
            </Button>
            <Button
              variant="outlined"
              className="border-neutral-300 text-neutral-700 hover:border-neutral-400"
              disabled={isLoading || !avatarUrl}
              onClick={onRemove}
            >
              {t("photo.remove")}
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/jpg,image/gif"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>
          <Typography variant="caption" className="text-neutral-500">
            {t("photo.hint")}
          </Typography>
          {errorMessage && (
            <Typography variant="caption" className="text-red-600">
              {errorMessage}
            </Typography>
          )}
        </div>
      </div>
    </section>
  );
}
