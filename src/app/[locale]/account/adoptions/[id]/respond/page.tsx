import { AnswerRequestPage } from "@/presentation/components/answer-request/AnswerRequestPage";

export default async function RespondToAdoptionRequestPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const trimmedId = id?.trim?.() ?? "";
  const requestId = trimmedId.length > 0 ? Number(trimmedId) : NaN;

  return <AnswerRequestPage requestId={requestId} />;
}
