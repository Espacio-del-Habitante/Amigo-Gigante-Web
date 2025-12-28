import type { ReactNode } from "react";

import { FoundationLayout } from "@/presentation/components/layouts";

export default function FoundationsLayout({ children }: { children: ReactNode }) {
  return <FoundationLayout>{children}</FoundationLayout>;
}
