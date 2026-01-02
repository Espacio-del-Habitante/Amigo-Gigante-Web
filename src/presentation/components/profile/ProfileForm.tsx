'use client';

import { useFormik } from 'formik';
import {
  Button,
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
import LogoSection from './LogoSection';
import { getProfileValidationSchema } from './ProfileValidation';

const ProfileForm = () => {
  const t = useTranslations('profile');

  const formik = useFormik({
    initialValues: {
      name: '',
      description: '',
      address: '',
      city: '',
      country: '',
      publicEmail: '',
      publicPhone: '',
      instagramUrl: '',
      whatsappUrl: '',
    },
    validationSchema: getProfileValidationSchema(t),
    onSubmit: () => undefined,
  });

  const descriptionCount = formik.values.description.length;

  return (
    <form onSubmit={formik.handleSubmit} className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <Typography variant="h4" className="text-neutral-900">
          {t('title')}
        </Typography>
        <Typography variant="body1" className="text-neutral-600">
          {t('subtitle')}
        </Typography>
      </div>

      <LogoSection />

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
        >
          {t('buttons.cancel')}
        </Button>
        <Button
          variant="contained"
          className="bg-brand-500 text-white hover:bg-brand-600"
          startIcon={<Save />}
          type="submit"
          fullWidth
        >
          {t('buttons.save')}
        </Button>
      </div>
    </form>
  );
};

export default ProfileForm;
