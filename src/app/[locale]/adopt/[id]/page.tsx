import { AdoptDetailPage } from "@/presentation/components/adopt-detail/AdoptDetailPage";

export default function AdoptDetailRoute({
  params,
}: {
  params: { id: string };
}) {
  const parsedId = Number(params.id);
  const animalId = Number.isFinite(parsedId) ? parsedId : null;

  return <AdoptDetailPage animalId={animalId} />;
}
