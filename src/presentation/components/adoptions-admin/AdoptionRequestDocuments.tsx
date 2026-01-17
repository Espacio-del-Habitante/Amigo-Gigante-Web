"use client";

import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import { Box, IconButton, Tooltip, Typography } from "@mui/material";
import { useTranslations } from "next-intl";

import type { AdoptionRequestDocument } from "@/domain/models/AdoptionRequestDocument";

export interface AdoptionRequestDocumentsProps {
  documents: AdoptionRequestDocument[];
}

const isImageFile = (url: string) => /\.(png|jpe?g|gif|webp)$/i.test(url);

const getFileName = (url: string) => {
  const rawName = url.split("/").pop() ?? "";
  return decodeURIComponent(rawName.split("?")[0] ?? "");
};

export function AdoptionRequestDocuments({ documents }: AdoptionRequestDocumentsProps) {
  const t = useTranslations("adoptionsAdmin");

  return (
    <Box className="rounded-2xl border border-neutral-100 bg-white">
      <Box className="flex items-center gap-2 border-b border-neutral-100 bg-neutral-50 px-6 py-4">
        <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
          {t("detail.documents.title")}
        </Typography>
      </Box>
      <Box className="p-6">
        {documents.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            {t("detail.documents.empty")}
          </Typography>
        ) : (
          <Box className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {documents.map((document) => {
              const fileName = getFileName(document.fileUrl);
              const previewStyle = isImageFile(document.fileUrl)
                ? {
                    backgroundImage: `url(${document.fileUrl})`,
                  }
                : undefined;

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
                          component="a"
                          href={document.fileUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="bg-white/20 text-neutral-50 hover:bg-white/40"
                          size="small"
                          aria-label={t("detail.documents.actions.view")}
                        >
                          <VisibilityRoundedIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title={t("detail.documents.actions.download")}>
                        <IconButton
                          component="a"
                          href={document.fileUrl}
                          download
                          className="bg-white/20 text-neutral-50 hover:bg-white/40"
                          size="small"
                          aria-label={t("detail.documents.actions.download")}
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
