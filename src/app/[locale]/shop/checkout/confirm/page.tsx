import { Suspense } from "react";

import { PurchaseConfirmationPage } from "@/presentation/components/purchase/PurchaseConfirmationPage";

export default function PurchaseConfirmRoutePage() {
  return (
    <Suspense fallback={null}>
      <PurchaseConfirmationPage />
    </Suspense>
  );
}
