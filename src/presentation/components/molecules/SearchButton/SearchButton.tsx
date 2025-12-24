"use client";

import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import { useTranslations } from "next-intl";

import { IconButton, type IconButtonProps } from "@/presentation/components/atoms";

export interface SearchButtonProps extends Omit<IconButtonProps, "children"> {
  ariaLabel?: string;
}

export function SearchButton({ ariaLabel, ...props }: SearchButtonProps) {
  const t = useTranslations("common");
  const resolvedLabel = ariaLabel ?? t("buttons.search");

  return (
    <IconButton aria-label={resolvedLabel} {...props}>
      <SearchRoundedIcon />
    </IconButton>
  );
}
