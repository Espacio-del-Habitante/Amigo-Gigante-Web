"use client";

import ChatRoundedIcon from "@mui/icons-material/ChatRounded";
import EmailRoundedIcon from "@mui/icons-material/EmailRounded";
import InstagramIcon from "@mui/icons-material/Instagram";
import PhoneRoundedIcon from "@mui/icons-material/PhoneRounded";
import PlaceRoundedIcon from "@mui/icons-material/PlaceRounded";
import { Alert, Box, CircularProgress, Typography } from "@mui/material";
import { useTranslations } from "next-intl";
import { useEffect, useMemo, useState } from "react";

import type { FoundationContact } from "@/domain/models/FoundationContact";
import { GetFoundationContactsUseCase } from "@/domain/usecases/foundation/GetFoundationContactsUseCase";
import { appContainer } from "@/infrastructure/ioc/container";
import { USE_CASE_TYPES } from "@/infrastructure/ioc/usecases/usecases.types";
import { Button } from "@/presentation/components/atoms";

type ContactErrorKey =
  | "errors.unauthorized"
  | "errors.connection"
  | "errors.notFound"
  | "errors.generic";

interface AdoptContactPanelProps {
  foundationId: string;
}

export function AdoptContactPanel({ foundationId }: AdoptContactPanelProps) {
  const t = useTranslations("adoptRequest");
  const [contact, setContact] = useState<FoundationContact | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorKey, setErrorKey] = useState<ContactErrorKey | null>(null);

  const getFoundationContactsUseCase = useMemo(
    () => appContainer.get<GetFoundationContactsUseCase>(USE_CASE_TYPES.GetFoundationContactsUseCase),
    [],
  );

  useEffect(() => {
    let isMounted = true;
    const loadContacts = async () => {
      if (!foundationId) {
        setErrorKey("errors.notFound");
        return;
      }

      setIsLoading(true);
      setErrorKey(null);
      try {
        const result = await getFoundationContactsUseCase.execute({ foundationId });
        if (!isMounted) return;
        setContact(result);
      } catch (error) {
        if (!isMounted) return;
        if (error instanceof Error) {
          const key = error.message as ContactErrorKey;
          if (
            key === "errors.unauthorized" ||
            key === "errors.connection" ||
            key === "errors.notFound" ||
            key === "errors.generic"
          ) {
            setErrorKey(key);
            return;
          }
        }
        setErrorKey("errors.generic");
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    void loadContacts();

    return () => {
      isMounted = false;
    };
  }, [foundationId, getFoundationContactsUseCase]);

  const foundationName = contact?.foundationName || t("contact.foundationFallback");

  const whatsappUrl = contact?.whatsappUrl ?? null;
  const instagramUrl = contact?.instagramUrl ?? null;
  const phone = contact?.publicPhone ?? null;
  const email = contact?.publicEmail ?? null;
  const address = contact?.address ?? null;
  const phoneHref = phone ? `tel:${phone.replace(/\\s+/g, "")}` : undefined;
  const emailHref = email ? `mailto:${email}` : undefined;

  return (
    <Box className="space-y-6">
      <Box className="flex flex-col items-center text-center">
        <Box className="mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-brand-50">
          <img src="/file.svg" alt={t("contact.heroAlt")} className="h-16 w-16" />
        </Box>
        <Typography variant="h5" sx={{ fontWeight: 900 }}>
          {t("contact.title")}
        </Typography>
        <Typography variant="body2" color="text.secondary" className="mt-2">
          {t("contact.subtitle", { foundation: foundationName })}
        </Typography>
      </Box>

      {isLoading ? (
        <Box className="flex flex-col items-center gap-2 py-6">
          <CircularProgress size={24} />
          <Typography variant="caption" color="text.secondary">
            {t("states.loading")}
          </Typography>
        </Box>
      ) : errorKey ? (
        <Alert severity="error">{t(errorKey)}</Alert>
      ) : contact ? (
        <Box className="space-y-4">
          <Button
            fullWidth
            tone="secondary"
            startIcon={<ChatRoundedIcon fontSize="small" />}
            component={whatsappUrl ? "a" : "button"}
            href={whatsappUrl ?? undefined}
            disabled={!whatsappUrl}
          >
            {t("contact.actions.whatsapp")}
          </Button>

          <Box className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Box
              component={phoneHref ? "a" : "div"}
              href={phoneHref}
              className="flex flex-col items-center gap-1 rounded-xl border border-neutral-100 bg-neutral-50 p-4 text-center"
            >
              <PhoneRoundedIcon className="text-brand-500" />
              <Typography variant="caption" sx={{ fontWeight: 800 }}>
                {t("contact.actions.call")}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {phone ?? t("contact.emptyValue")}
              </Typography>
            </Box>

            <Box
              component={instagramUrl ? "a" : "div"}
              href={instagramUrl ?? undefined}
              target={instagramUrl ? "_blank" : undefined}
              rel={instagramUrl ? "noreferrer" : undefined}
              className="flex flex-col items-center gap-1 rounded-xl border border-neutral-100 bg-neutral-50 p-4 text-center"
            >
              <InstagramIcon className="text-accent-500" />
              <Typography variant="caption" sx={{ fontWeight: 800 }}>
                {t("contact.actions.instagram")}
              </Typography>
              <Typography variant="caption" color="text.secondary" className="break-all">
                {instagramUrl ?? t("contact.emptyValue")}
              </Typography>
            </Box>
          </Box>

          <Box
            component={emailHref ? "a" : "div"}
            href={emailHref}
            className="flex items-center gap-3 rounded-xl border border-neutral-100 bg-neutral-50 p-4"
          >
            <EmailRoundedIcon className="text-neutral-400" />
            <Box>
              <Typography variant="caption" sx={{ fontWeight: 800 }}>
                {t("contact.actions.email")}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {email ?? t("contact.emptyValue")}
              </Typography>
            </Box>
          </Box>

          <Box className="flex items-start gap-3 rounded-xl border border-neutral-100 bg-neutral-50 p-4">
            <PlaceRoundedIcon className="text-neutral-400" />
            <Box>
              <Typography variant="caption" sx={{ fontWeight: 800 }}>
                {t("contact.actions.address")}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {address ?? t("contact.emptyValue")}
              </Typography>
            </Box>
          </Box>
        </Box>
      ) : null}
    </Box>
  );
}
