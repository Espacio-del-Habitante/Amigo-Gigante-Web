import SearchRoundedIcon from "@mui/icons-material/SearchRounded";

import { IconButton, type IconButtonProps } from "@/presentation/components/atoms";

export interface SearchButtonProps extends Omit<IconButtonProps, "children"> {
  ariaLabel?: string;
}

export function SearchButton({ ariaLabel = "Buscar", ...props }: SearchButtonProps) {
  return (
    <IconButton aria-label={ariaLabel} {...props}>
      <SearchRoundedIcon />
    </IconButton>
  );
}
