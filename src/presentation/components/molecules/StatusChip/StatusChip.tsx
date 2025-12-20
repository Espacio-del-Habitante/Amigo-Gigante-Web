import type { AnimalStatus } from "@/domain/models/Animal";
import { Chip, type ChipProps } from "@/presentation/components/atoms";

type StatusVisual = Pick<ChipProps, "tone" | "variant">;

const statusVisualMap: Record<AnimalStatus, StatusVisual> = {
  Adopción: { tone: "brand", variant: "soft" },
  Apadrinamiento: { tone: "accent", variant: "soft" },
  Urgente: { tone: "accent", variant: "solid" },
};

export interface StatusChipProps extends Omit<ChipProps, "tone" | "variant" | "label"> {
  status: AnimalStatus;
}

export function StatusChip({ status, ...props }: StatusChipProps) {
  const visual = statusVisualMap[status];

  return <Chip label={status} size="small" {...visual} {...props} />;
}
