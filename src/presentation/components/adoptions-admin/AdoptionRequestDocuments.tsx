"use client";

import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import { Box, IconButton, Tooltip, Typography } from "@mui/material";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useMemo, useState } from "react";

import type { AdoptionRequestDocument } from "@/domain/models/AdoptionRequestDocument";
import { GetPrivateFileUrlUseCase } from "@/domain/usecases/storage/GetPrivateFileUrlUseCase";
import { appContainer } from "@/infrastructure/ioc/container";
import { USE_CASE_TYPES } from "@/infrastructure/ioc/usecases/usecases.types";

export interface AdoptionRequestDocumentsProps {
  documents: AdoptionRequestDocument[];
}

const isImageFile = (url: string) => /\.(png|jpe?g|gif|webp)$/i.test(url);

const getFileName = (filePath: string) => {
  const rawName = filePath.split("/").pop() ?? "";
  return decodeURIComponent(rawName.split("?")[0] ?? "");
};

const SIGNED_URL_REFRESH_MS = 55 * 60 * 1000;

export function AdoptionRequestDocuments({ documents }: AdoptionRequestDocumentsProps) {
  const t = useTranslations("adoptionsAdmin");
  const tStorage = useTranslations("storage");
  const getPrivateFileUrlUseCase = useMemo(
    () => appContainer.get<GetPrivateFileUrlUseCase>(USE_CASE_TYPES.GetPrivateFileUrlUseCase),
    [],
  );
  const [signedUrls, setSignedUrls] = useState<Record<number, string>>({});
  const [errorKeys, setErrorKeys] = useState<Record<number, string>>({});
  const [refreshing, setRefreshing] = useState(false);

  const resolveStorageKey = useCallback((key: string) => key.replace(/^storage\./, ""), []);

  const loadSignedUrls = useCallback(async () => {
    const nextUrls: Record<number, string> = {};
    const nextErrors: Record<number, string> = {};

    await Promise.all(
      documents.map(async (document) => {
        try {
          if (document.fileUrl.startsWith("http")) {
            nextUrls[document.id] = document.fileUrl;
            return;
          }
          const signedUrl = await getPrivateFileUrlUseCase.execute({ filePath: document.fileUrl });
          nextUrls[document.id] = signedUrl;
        } catch (error) {
          if (error instanceof Error && error.message) {
            nextErrors[document.id] = error.message;
          } else {
            nextErrors[document.id] = "storage.private.url.error.generating";
          }
        }
      }),
    );

    setSignedUrls(nextUrls);
    setErrorKeys(nextErrors);
  }, [documents, getPrivateFileUrlUseCase]);

  useEffect(() => {
    let isActive = true;

    const load = async () => {
      await loadSignedUrls();
    };

    load().catch(() => {
      if (!isActive) return;
    });

    return () => {
      isActive = false;
    };
  }, [loadSignedUrls]);

  useEffect(() => {
    if (documents.length === 0) return;

    const timer = setTimeout(() => {
      setRefreshing(true);
      loadSignedUrls()
        .catch(() => {})
        .finally(() => setRefreshing(false));
    }, SIGNED_URL_REFRESH_MS);

    return () => clearTimeout(timer);
  }, [documents.length, loadSignedUrls]);

  return (
    <Box className="rounded-2xl border border-neutral-100 bg-white">
      <Box className="flex items-center gap-2 border-b border-neutral-100 bg-neutral-50 px-6 py-4">
        <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
          {t("detail.documents.title")}
        </Typography>
      </Box>
      <Box className="p-6">
        {refreshing ? (
          <Typography variant="caption" color="text.secondary" className="mb-3 block">
            {tStorage(resolveStorageKey("storage.private.url.expired"))}
          </Typography>
        ) : null}
        {documents.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            {t("detail.documents.empty")}
          </Typography>
        ) : (
          <Box className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {documents.map((document) => {
              const fileName = getFileName(document.fileUrl);
              const signedUrl = signedUrls[document.id];
              const errorKey = errorKeys[document.id];
              const canPreview = signedUrl && isImageFile(document.fileUrl);
              const previewStyle = canPreview
                ? {
                    backgroundImage: `url(${signedUrl})`,
                  }
                : undefined;
              const hasUrl = Boolean(signedUrl);

              return (
                <Box
                  key={document.id}
                  className="group overflow-hidden rounded-xl border border-neutral-100 bg-neutral-50"
                >
                  <Box
                    className="relative aspect-square bg-neutral-100 bg-cover bg-center"
                    style={previewStyle}
                  >
                    {!previewStyle ? (
                      <Box className="flex h-full items-center justify-center text-sm font-semibold text-neutral-400">
                        {t("detail.documents.previewUnavailable")}
                      </Box>
                    ) : null}
                    <Box className="absolute inset-0 flex items-center justify-center gap-2 bg-neutral-900/60 opacity-0 transition-opacity group-hover:opacity-100">
                      <Tooltip title={t("detail.documents.actions.view")}>
                        <IconButton
                          component={hasUrl ? "a" : "button"}
                          href={hasUrl ? signedUrl : undefined}
                          target={hasUrl ? "_blank" : undefined}
                          rel={hasUrl ? "noreferrer" : undefined}
                          className="bg-white/20 text-neutral-50 hover:bg-white/40"
                          size="small"
                          aria-label={t("detail.documents.actions.view")}
                          disabled={!hasUrl}
                        >
                          <VisibilityRoundedIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title={t("detail.documents.actions.download")}>
                        <IconButton
                          component={hasUrl ? "a" : "button"}
                          href={hasUrl ? signedUrl : undefined}
                          download={hasUrl}
                          className="bg-white/20 text-neutral-50 hover:bg-white/40"
                          size="small"
                          aria-label={t("detail.documents.actions.download")}
                          disabled={!hasUrl}
                        >
                          <DownloadRoundedIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Box>
                  <Box className="space-y-1 px-3 py-2">
                    <Typography variant="caption" color="text.secondary">
                      {t(`detail.documents.types.${document.docType}`)}
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 700 }} className="truncate">
                      {fileName || t("labels.notAvailable")}
                    </Typography>
                    {document.notes ? (
                      <Typography variant="caption" color="text.secondary" className="line-clamp-2">
                        {document.notes}
                      </Typography>
                    ) : null}
                    {errorKey ? (
                      <Typography variant="caption" color="error" className="line-clamp-2">
                        {errorKey.startsWith("storage.")
                          ? tStorage(resolveStorageKey(errorKey))
                          : errorKey}
                      </Typography>
                    ) : null}
                  </Box>
                </Box>
              );
            })}
          </Box>
        )}
      </Box>
    </Box>
  );
}
