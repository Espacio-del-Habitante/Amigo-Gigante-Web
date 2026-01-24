"use client";

import { useRef, useState } from "react";
import { useTranslations } from "next-intl";

import { Button } from "@/presentation/components/atoms";

interface FileUploadZoneProps {
  files: File[];
  disabled?: boolean;
  onAddFiles: (files: File[]) => void;
  onRemoveFile: (index: number) => void;
}

const resolveFileIcon = (file: File) => {
  if (file.type.startsWith("video/")) return "video_library";
  if (file.type === "application/pdf") return "picture_as_pdf";
  if (file.type.startsWith("image/")) return "image";
  return "description";
};

export function FileUploadZone({ files, disabled, onAddFiles, onRemoveFile }: FileUploadZoneProps) {
  const t = useTranslations("answerRequest");
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleSelectFiles = (selectedFiles: FileList | null) => {
    if (!selectedFiles) return;
    onAddFiles(Array.from(selectedFiles));
  };

  return (
    <div className="space-y-4">
      <div
        className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-10 text-center transition-colors ${
          isDragging ? "border-brand-500 bg-brand-50" : "border-neutral-200"
        } ${disabled ? "cursor-not-allowed opacity-60" : "hover:border-brand-400"}`}
        onClick={() => {
          if (!disabled) {
            inputRef.current?.click();
          }
        }}
        onDragOver={(event) => {
          event.preventDefault();
          if (!disabled) setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          setIsDragging(false);
          if (disabled) return;
          handleSelectFiles(event.dataTransfer.files);
        }}
      >
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-neutral-100 text-neutral-500">
          <span className="material-symbols-outlined text-3xl">cloud_upload</span>
        </div>
        <p className="text-sm font-bold text-neutral-700">{t("form.files.dropzone.title")}</p>
        <p className="mt-1 text-xs text-neutral-500">{t("form.files.dropzone.description")}</p>
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          multiple
          accept=".mp4,.jpg,.jpeg,.png,.pdf"
          onChange={(event) => {
            handleSelectFiles(event.target.files);
            event.target.value = "";
          }}
          disabled={disabled}
        />
      </div>

      {files.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {files.map((file, index) => (
            <div
              key={`${file.name}-${index}`}
              className="flex items-center gap-2 rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2"
            >
              <span className="material-symbols-outlined text-sm text-neutral-500">{resolveFileIcon(file)}</span>
              <span className="text-xs font-medium text-neutral-700">{file.name}</span>
              <Button
                type="button"
                tone="neutral"
                variant="ghost"
                size="small"
                onClick={() => onRemoveFile(index)}
                aria-label={t("form.cancel")}
              >
                <span className="material-symbols-outlined text-sm">close</span>
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
