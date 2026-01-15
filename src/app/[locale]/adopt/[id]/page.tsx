import { AdoptDetailPage } from "@/presentation/components/adopt-detail/AdoptDetailPage";

export default async function AdoptDetailRoute({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const trimmedId = id?.trim?.() ?? "";

  return <AdoptDetailPage animalId={trimmedId.length > 0 ? trimmedId : null} />;
}
