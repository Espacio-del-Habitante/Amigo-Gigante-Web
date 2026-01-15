import { ShopDetailPage } from "@/presentation/components/shop-detail/ShopDetailPage";

export default async function ShopDetailRoute({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const trimmedId = id?.trim?.() ?? "";

  return <ShopDetailPage productId={trimmedId.length > 0 ? trimmedId : null} />;
}
