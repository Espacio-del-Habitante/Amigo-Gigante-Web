import type { ReactNode } from "react";

import { FoundationLayout } from "@/presentation/components/layouts";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return <FoundationLayout>{children}</FoundationLayout>;
}
