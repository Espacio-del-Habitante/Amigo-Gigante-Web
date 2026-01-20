'use client';

import { useFormik } from 'formik';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Divider,
  InputAdornment,
  MenuItem,
  TextField,
  Typography,
} from '@mui/material';
import {
  Email,
  Home,
  Instagram,
  Phone,
  Save,
  WhatsApp,
} from '@mui/icons-material';
import { useTranslations } from 'next-intl';
import { useEffect, useMemo, useState } from 'react';
import LogoSection from './LogoSection';
import { getProfileValidationSchema, type TranslationFunction } from './ProfileValidation';
import type { FoundationProfile } from '@/domain/models/FoundationProfile';
import { GetFoundationProfileUseCase } from '@/domain/usecases/foundation/GetFoundationProfileUseCase';
import { UpdateFoundationProfileUseCase } from '@/domain/usecases/foundation/UpdateFoundationProfileUseCase';
import { appContainer } from '@/infrastructure/ioc/container';
import { USE_CASE_TYPES } from '@/infrastructure/ioc/usecases/usecases.types';
import { ConfirmDialog } from '@/presentation/components/atoms/ConfirmDialog';

interface ProfileFormValues {
  name: string;
  description: string;
  address: string;
  city: string;
  country: string;
  publicEmail: string;
  publicPhone: string;
  instagramUrl: string;
  whatsappUrl: string;
}

interface ProfileMeta {
  foundationId: string;
  logoUrl: string | null;
}

const emptyProfileValues: ProfileFormValues = {
  name: '',
  description: '',
  address: '',
  city: '',
  country: '',
  publicEmail: '',
  publicPhone: '',
  instagramUrl: '',
  whatsappUrl: '',
};

const errorMessageKeyList = ['errors.unauthorized', 'errors.notFound', 'errors.connection', 'errors.generic'] as const;

type FoundationErrorMessageKey = (typeof errorMessageKeyList)[number];

const errorMessageKeys = new Set<FoundationErrorMessageKey>(errorMessageKeyList);

const ProfileForm = () => {
  const t = useTranslations('profile');
  const foundationT = useTranslations('foundation');
  const getFoundationProfileUseCase = useMemo(
    () => appContainer.get<GetFoundationProfileUseCase>(USE_CASE_TYPES.GetFoundationProfileUseCase),
    [],
  );
  const updateFoundationProfileUseCase = useMemo(
    () =>
      appContainer.get<UpdateFoundationProfileUseCase>(
        USE_CASE_TYPES.UpdateFoundationProfileUseCase,
      ),
    [],
  );
  const [initialValues, setInitialValues] = useState<ProfileFormValues>(emptyProfileValues);
  const [profileMeta, setProfileMeta] = useState<ProfileMeta>({ foundationId: '', logoUrl: null });
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
  const [showDiscardDialog, setShowDiscardDialog] = useState(false);

  const resolveErrorMessage = (error: unknown) => {
    if (error instanceof Error) {
      if (error.message === 'storage.upload.error.invalidFormat') {
        return t('logo.errors.invalidFormat');
      }

      if (error.message === 'storage.upload.error.fileTooLarge') {
        return t('logo.errors.tooLarge');
      }

      if (error.message.startsWith('storage.upload.error')) {
        return t('logo.errors.uploadFailed');
      }

      const key = error.message as FoundationErrorMessageKey;
      if (errorMessageKeys.has(key)) {
        return foundationT(key);
      }
    }

    return foundationT('errors.generic');
  };

  const loadProfile = async () => {
    setIsLoading(true);
    setSubmitError(null);

    try {
      const profile = await getFoundationProfileUseCase.execute();
      setInitialValues({
        name: profile.name,
        description: profile.description,
        address: profile.address,
        city: profile.city,
        country: profile.country,
        publicEmail: profile.publicEmail,
        publicPhone: profile.publicPhone,
        instagramUrl: profile.instagramUrl,
        whatsappUrl: profile.whatsappUrl,
      });
      setProfileMeta({ foundationId: profile.foundationId, logoUrl: profile.logoUrl });
      setLogoFile(null);
    } catch (error) {
      setSubmitError(resolveErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadProfile();
  }, []);

  const formik = useFormik({
    initialValues,
    validationSchema: getProfileValidationSchema(t as unknown as TranslationFunction),
    enableReinitialize: true,
    onSubmit: async (values, helpers) => {
      setSubmitError(null);
      setSubmitSuccess(null);

      try {
        const payload: FoundationProfile & { logoFile?: File | null } = {
          foundationId: profileMeta.foundationId,
          logoUrl: profileMeta.logoUrl,
          logoFile,
          ...values,
        };

        const updatedProfile = await updateFoundationProfileUseCase.execute(payload);

        setSubmitSuccess(t('feedback.saveSuccess'));
        const nextValues: ProfileFormValues = {
          name: updatedProfile.name,
          description: updatedProfile.description,
          address: updatedProfile.address,
          city: updatedProfile.city,
          country: updatedProfile.country,
          publicEmail: updatedProfile.publicEmail,
          publicPhone: updatedProfile.publicPhone,
          instagramUrl: updatedProfile.instagramUrl,
          whatsappUrl: updatedProfile.whatsappUrl,
        };

        setInitialValues(nextValues);
        setLogoFile(null);
        setProfileMeta({
          foundationId: updatedProfile.foundationId,
          logoUrl: updatedProfile.logoUrl,
        });
        helpers.resetForm({ values: nextValues });
      } catch (error) {
        setSubmitError(resolveErrorMessage(error));
      } finally {
        helpers.setSubmitting(false);
      }
    },
  });

  const descriptionCount = formik.values.description.length;

  const handleCancel = () => {
    setSubmitSuccess(null);
    setSubmitError(null);

    if (!formik.dirty) {
      return;
    }

    setShowDiscardDialog(true);
  };

  const handleDiscardConfirm = async () => {
    setShowDiscardDialog(false);
    await loadProfile();
  };

  return (
    <form onSubmit={formik.handleSubmit} className="flex flex-col gap-8">
      {isLoading && (
        <Box className="flex items-center gap-3 text-neutral-600">
          <CircularProgress size={20} />
          <Typography variant="body2">{t('status.loading')}</Typography>
        </Box>
      )}

      {submitError && (
        <Alert severity="error" className="font-semibold">
          {submitError}
        </Alert>
      )}

      {submitSuccess && (
        <Alert severity="success" className="font-semibold">
          {submitSuccess}
        </Alert>
      )}

      <div className="flex flex-col gap-2">
        <Typography variant="h4" className="text-neutral-900">
          {t('title')}
        </Typography>
        <Typography variant="body1" className="text-neutral-600">
          {t('subtitle')}
        </Typography>
      </div>

      <LogoSection
        currentLogoUrl={profileMeta.logoUrl}
        onLogoSelect={(file) => {
          setLogoFile(file);
        }}
        onLogoRemove={() => {
          setLogoFile(null);
          setProfileMeta((current) => ({ ...current, logoUrl: null }));
        }}
        isUploading={formik.isSubmitting || isLoading}
      />

      <div className="rounded-xl border border-neutral-200 bg-white p-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <TextField
            fullWidth
            name="name"
            label={t('fields.name.label')}
            placeholder={t('fields.name.placeholder')}
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.name && Boolean(formik.errors.name)}
            helperText={formik.touched.name ? formik.errors.name : undefined}
            className="md:col-span-2"
          />

          <TextField
            fullWidth
            multiline
            minRows={4}
            name="description"
            label={t('fields.description.label')}
            placeholder={t('fields.description.placeholder')}
            value={formik.values.description}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.description && Boolean(formik.errors.description)}
            helperText={formik.touched.description ? formik.errors.description : undefined}
            className="md:col-span-2"
          />
          <Typography
            variant="caption"
            className="md:col-span-2 text-right text-neutral-500"
          >
            {t('fields.description.charCount', { current: descriptionCount })}
          </Typography>

          <div className="md:col-span-2 flex items-center gap-3">
            <Divider className="flex-1" />
            <Typography variant="subtitle2" className="text-neutral-500">
              {t('sections.location')}
            </Typography>
            <Divider className="flex-1" />
          </div>

          <TextField
            fullWidth
            name="address"
            label={t('fields.address.label')}
            placeholder={t('fields.address.placeholder')}
            value={formik.values.address}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.address && Boolean(formik.errors.address)}
            helperText={formik.touched.address ? formik.errors.address : undefined}
            className="md:col-span-2"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Home className="text-neutral-400" />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            fullWidth
            name="city"
            label={t('fields.city.label')}
            placeholder={t('fields.city.placeholder')}
            value={formik.values.city}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.city && Boolean(formik.errors.city)}
            helperText={formik.touched.city ? formik.errors.city : undefined}
          />

          <TextField
            fullWidth
            select
            name="country"
            label={t('fields.country.label')}
            value={formik.values.country}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.country && Boolean(formik.errors.country)}
            helperText={formik.touched.country ? formik.errors.country : undefined}
          >
            <MenuItem value="" disabled>
              {t('fields.country.placeholder')}
            </MenuItem>
            <MenuItem value="mx">{t('countries.mx')}</MenuItem>
            <MenuItem value="us">{t('countries.us')}</MenuItem>
            <MenuItem value="es">{t('countries.es')}</MenuItem>
          </TextField>

          <div className="md:col-span-2 flex items-center gap-3">
            <Divider className="flex-1" />
            <Typography variant="subtitle2" className="text-neutral-500">
              {t('sections.contact')}
            </Typography>
            <Divider className="flex-1" />
          </div>

          <TextField
            fullWidth
            name="publicEmail"
            label={t('fields.publicEmail.label')}
            placeholder={t('fields.publicEmail.placeholder')}
            value={formik.values.publicEmail}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.publicEmail && Boolean(formik.errors.publicEmail)}
            helperText={formik.touched.publicEmail ? formik.errors.publicEmail : undefined}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Email className="text-neutral-400" />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            fullWidth
            name="publicPhone"
            label={t('fields.publicPhone.label')}
            placeholder={t('fields.publicPhone.placeholder')}
            value={formik.values.publicPhone}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.publicPhone && Boolean(formik.errors.publicPhone)}
            helperText={formik.touched.publicPhone ? formik.errors.publicPhone : undefined}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Phone className="text-neutral-400" />
                </InputAdornment>
              ),
            }}
          />

          <div className="md:col-span-2 flex items-center gap-3">
            <Divider className="flex-1" />
            <Typography variant="subtitle2" className="text-neutral-500">
              {t('sections.social')}
            </Typography>
            <Divider className="flex-1" />
          </div>

          <TextField
            fullWidth
            name="instagramUrl"
            label={t('fields.instagramUrl.label')}
            placeholder={t('fields.instagramUrl.placeholder')}
            value={formik.values.instagramUrl}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.instagramUrl && Boolean(formik.errors.instagramUrl)}
            helperText={formik.touched.instagramUrl ? formik.errors.instagramUrl : undefined}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Instagram className="text-neutral-400" />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            fullWidth
            name="whatsappUrl"
            label={t('fields.whatsappUrl.label')}
            placeholder={t('fields.whatsappUrl.placeholder')}
            value={formik.values.whatsappUrl}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.whatsappUrl && Boolean(formik.errors.whatsappUrl)}
            helperText={formik.touched.whatsappUrl ? formik.errors.whatsappUrl : undefined}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <WhatsApp className="text-neutral-400" />
                </InputAdornment>
              ),
            }}
          />
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
        <Button
          variant="outlined"
          className="border-neutral-300 text-neutral-700 hover:border-neutral-400"
          type="button"
          fullWidth
          disabled={formik.isSubmitting || isLoading}
          onClick={handleCancel}
        >
          {t('buttons.cancel')}
        </Button>
        <Button
          variant="contained"
          className="bg-brand-500 text-white hover:bg-brand-600"
          startIcon={
            formik.isSubmitting ? <CircularProgress size={18} color="inherit" /> : <Save />
          }
          type="submit"
          fullWidth
          disabled={formik.isSubmitting || isLoading}
        >
          {formik.isSubmitting ? t('buttons.saving') : t('buttons.save')}
        </Button>
      </div>

      <ConfirmDialog
        open={showDiscardDialog}
        title={t('dialog.discard.title')}
        description={t('dialog.discard.description')}
        confirmLabel={t('dialog.discard.confirm')}
        cancelLabel={t('dialog.discard.cancel')}
        onConfirm={handleDiscardConfirm}
        onClose={() => setShowDiscardDialog(false)}
      />
    </form>
  );
};

export default ProfileForm;
