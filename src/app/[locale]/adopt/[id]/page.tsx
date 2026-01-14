import { AdoptDetailPage } from "@/presentation/components/adopt-detail/AdoptDetailPage";

export default function AdoptDetailRoute({ params }: { params: { id: string } }) {
  return <AdoptDetailPage animalId={params.id} />;
}
