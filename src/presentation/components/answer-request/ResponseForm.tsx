"use client";

import { Alert, CircularProgress, Typography } from "@mui/material";
import { useLocale, useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { RespondToInfoRequestUseCase } from "@/domain/usecases/adopt/RespondToInfoRequestUseCase";
import { appContainer } from "@/infrastructure/ioc/container";
import { USE_CASE_TYPES } from "@/infrastructure/ioc/usecases/usecases.types";
import { Button } from "@/presentation/components/atoms";
import { FileUploadZone } from "@/presentation/components/answer-request/FileUploadZone";

interface ResponseFormProps {
  requestId: number;
}

const MAX_RESPONSE_FILE_BYTES = 50 * 1024 * 1024;
const ALLOWED_RESPONSE_TYPES = new Set(["video/mp4", "image/jpeg", "image/jpg", "image/png", "application/pdf"]);

const errorKeyList = [
  "errors.unauthorized",
  "errors.invalidStatus",
  "errors.messageRequired",
  "errors.fileTooLarge",
  "errors.invalidFileType",
  "errors.uploadFailed",
  "errors.submitFailed",
] as const;

type ResponseErrorKey = (typeof errorKeyList)[number];

export function ResponseForm({ requestId }: ResponseFormProps) {
  const t = useTranslations("answerRequest");
  const locale = useLocale();
  const router = useRouter();

  const respondToInfoRequestUseCase = useMemo(
    () => appContainer.get<RespondToInfoRequestUseCase>(USE_CASE_TYPES.RespondToInfoRequestUseCase),
    [],
  );

  const [message, setMessage] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [errorKey, setErrorKey] = useState<ResponseErrorKey | null>(null);
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const mapErrorKey = (error: unknown): ResponseErrorKey => {
    if (error instanceof Error) {
      const messageKey = error.message as ResponseErrorKey;
      if (errorKeyList.includes(messageKey)) {
        return messageKey;
      }

      if (error.message === "storage.private.validation.maxSize") {
        return "errors.fileTooLarge";
      }

      if (error.message === "storage.private.validation.invalidType") {
        return "errors.invalidFileType";
      }

      if (error.message.startsWith("storage.private.upload") || error.message === "storage.private.connection") {
        return "errors.uploadFailed";
      }
    }

    return "errors.submitFailed";
  };

  const validateAndAddFiles = (incoming: File[]) => {
    const validFiles: File[] = [];
    let nextError: ResponseErrorKey | null = null;

    for (const file of incoming) {
      if (file.size > MAX_RESPONSE_FILE_BYTES) {
        nextError = "errors.fileTooLarge";
        continue;
      }

      if (!ALLOWED_RESPONSE_TYPES.has(file.type)) {
        nextError = "errors.invalidFileType";
        continue;
      }

      validFiles.push(file);
    }

    if (validFiles.length > 0) {
      setFiles((prev) => [...prev, ...validFiles]);
    }

    setErrorKey(nextError);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorKey(null);
    setIsSubmitting(true);

    try {
      await respondToInfoRequestUseCase.execute({
        requestId,
        message,
        files,
      });
      setSuccess(true);
      setTimeout(() => {
        router.replace(`/${locale}/account/adoptions`);
      }, 1500);
    } catch (error) {
      setErrorKey(mapErrorKey(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-8 shadow-soft">
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div>
          <label className="mb-2 block text-sm font-bold text-neutral-900" htmlFor="response-message">
            {t("form.message.label")}
          </label>
          <textarea
            id="response-message"
            className="w-full rounded-lg border border-neutral-200 px-4 py-3 text-sm text-neutral-800 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
            rows={4}
            placeholder={t("form.message.placeholder")}
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            disabled={isSubmitting}
          />
        </div>

        <div>
          <Typography variant="subtitle2" sx={{ fontWeight: 800 }} className="mb-2">
            {t("form.files.label")}
          </Typography>
          <FileUploadZone
            files={files}
            disabled={isSubmitting}
            onAddFiles={validateAndAddFiles}
            onRemoveFile={(index) =>
              setFiles((prev) => prev.filter((_, fileIndex) => fileIndex !== index))
            }
          />
        </div>

        {errorKey && <Alert severity="error">{t(errorKey)}</Alert>}
        {success && (
          <Alert severity="success">
            <strong>{t("success.title")}:</strong> {t("success.message")}
          </Alert>
        )}

        <div className="flex flex-wrap items-center justify-end gap-3 border-t border-neutral-100 pt-4">
          <Button
            type="button"
            tone="neutral"
            variant="ghost"
            onClick={() => router.replace(`/${locale}/account/adoptions`)}
            disabled={isSubmitting}
          >
            {t("form.cancel")}
          </Button>
          <Button type="submit" tone="primary" variant="solid" disabled={isSubmitting}>
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <CircularProgress size={18} color="inherit" />
                {t("form.submit")}
              </span>
            ) : (
              t("form.submit")
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
