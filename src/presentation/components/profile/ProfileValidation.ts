import * as Yup from 'yup';

export type TranslationFunction = (key: string, values?: Record<string, string | number>) => string;

const optionalUrl = (message: string) =>
  Yup.string()
    .transform((value) => (value === '' ? undefined : value))
    .url(message)
    .notRequired();

export const getProfileValidationSchema = (t: TranslationFunction) =>
  Yup.object({
    name: Yup.string()
      .required(t('validation.name.required'))
      .min(3, t('validation.name.minLength')),
    description: Yup.string()
      .required(t('validation.description.required'))
      .max(500, t('validation.description.maxLength')),
    address: Yup.string().required(t('validation.address.required')),
    city: Yup.string().required(t('validation.city.required')),
    country: Yup.string().required(t('validation.country.required')),
    publicEmail: Yup.string()
      .required(t('validation.publicEmail.required'))
      .email(t('validation.publicEmail.invalid')),
    publicPhone: Yup.string().optional(),
    instagramUrl: optionalUrl(t('validation.instagramUrl.invalid')),
    whatsappUrl: optionalUrl(t('validation.whatsappUrl.invalid')),
  });
