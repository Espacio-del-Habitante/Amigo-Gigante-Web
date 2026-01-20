'use client';

import { Alert, Avatar, Button, CircularProgress, Typography } from '@mui/material';
import { useTranslations } from 'next-intl';
import { useEffect, useRef, useState } from 'react';

interface LogoSectionProps {
  currentLogoUrl: string | null;
  onLogoSelect: (file: File | null) => void;
  onLogoRemove: () => void;
  isUploading?: boolean;
}

const MAX_LOGO_SIZE_BYTES = 5 * 1024 * 1024;
const VALID_LOGO_TYPES = new Set(['image/jpeg', 'image/jpg', 'image/png']);

const LogoSection = ({
  currentLogoUrl,
  onLogoSelect,
  onLogoRemove,
  isUploading = false,
}: LogoSectionProps) => {
  const t = useTranslations('profile');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentLogoUrl);
  const [objectUrl, setObjectUrl] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Limpiar blob URL cuando el componente se desmonte
  useEffect(() => {
    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [objectUrl]);

  // Actualizar preview cuando cambia currentLogoUrl (después de subir exitosamente)
  useEffect(() => {
    // Si hay un blob URL activo y currentLogoUrl cambió a una URL real (no null),
    // significa que se subió exitosamente, entonces limpiar el blob y usar la nueva URL
    if (objectUrl && currentLogoUrl && !currentLogoUrl.startsWith('blob:')) {
      URL.revokeObjectURL(objectUrl);
      setObjectUrl(null);
      setPreviewUrl(currentLogoUrl);
      return;
    }

    // Si no hay blob URL activo y currentLogoUrl cambió, actualizar preview
    if (!objectUrl && currentLogoUrl !== previewUrl) {
      setPreviewUrl(currentLogoUrl);
    }
  }, [currentLogoUrl, objectUrl, previewUrl]);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;

    if (!file) {
      return;
    }

    setErrorMessage(null);

    if (!VALID_LOGO_TYPES.has(file.type)) {
      setErrorMessage(t('logo.errors.invalidFormat'));
      event.target.value = '';
      return;
    }

    if (file.size > MAX_LOGO_SIZE_BYTES) {
      setErrorMessage(t('logo.errors.tooLarge'));
      event.target.value = '';
      return;
    }

    // Limpiar blob URL anterior si existe
    if (objectUrl) {
      URL.revokeObjectURL(objectUrl);
      setObjectUrl(null);
    }

    // Crear nuevo blob URL para preview
    const nextPreviewUrl = URL.createObjectURL(file);
    setObjectUrl(nextPreviewUrl);
    setPreviewUrl(nextPreviewUrl);
    onLogoSelect(file);
  };

  const handleRemove = () => {
    if (objectUrl) {
      URL.revokeObjectURL(objectUrl);
      setObjectUrl(null);
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }

    setErrorMessage(null);
    setPreviewUrl(null);
    onLogoRemove();
  };

  const isRemoveDisabled = !previewUrl || isUploading;

  return (
    <section className="flex flex-col gap-4 rounded-xl border border-neutral-200 bg-white p-6">
      <div className="flex items-center justify-between">
        <Typography variant="h6" className="text-neutral-900">
          {t('logo.title')}
        </Typography>
      </div>
      <div className="flex flex-col items-start gap-4 md:flex-row md:items-center">
        <Avatar
          variant="rounded"
          src={previewUrl ?? undefined}
          className="h-24 w-24 bg-neutral-100 text-neutral-400"
          alt={t('logo.title')}
          onError={() => {
            // Si falla al cargar la imagen, limpiar el preview
            if (previewUrl?.startsWith('blob:')) {
              URL.revokeObjectURL(previewUrl);
              setObjectUrl(null);
              setPreviewUrl(null);
            } else {
              setPreviewUrl(null);
            }
          }}
        />
        <div className="flex flex-wrap items-center gap-3">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/jpg,image/png"
            className="hidden"
            onChange={handleFileSelect}
            disabled={isUploading}
          />
          <Button
            variant="contained"
            className="bg-brand-500 text-white hover:bg-brand-600"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            startIcon={isUploading ? <CircularProgress size={16} /> : undefined}
          >
            {t('logo.upload')}
          </Button>
          <Button
            variant="outlined"
            className="border-neutral-300 text-neutral-700 hover:border-neutral-400"
            onClick={handleRemove}
            disabled={isRemoveDisabled}
          >
            {t('logo.remove')}
          </Button>
        </div>
      </div>
      {errorMessage ? (
        <Alert severity="error" className="font-semibold">
          {errorMessage}
        </Alert>
      ) : null}
      <Typography variant="body2" className="text-neutral-500">
        {t('logo.help')}
      </Typography>
    </section>
  );
};

export default LogoSection;
