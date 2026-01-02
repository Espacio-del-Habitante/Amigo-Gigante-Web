'use client';

import { Avatar, Button, Typography } from '@mui/material';
import { useTranslations } from 'next-intl';

const LogoSection = () => {
  const t = useTranslations('profile');

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
          className="h-24 w-24 bg-neutral-100 text-neutral-400"
          alt={t('logo.title')}
        />
        <div className="flex flex-wrap items-center gap-3">
          <Button
            variant="contained"
            className="bg-brand-500 text-white hover:bg-brand-600"
          >
            {t('logo.upload')}
          </Button>
          <Button
            variant="outlined"
            className="border-neutral-300 text-neutral-700 hover:border-neutral-400"
          >
            {t('logo.remove')}
          </Button>
        </div>
      </div>
      <Typography variant="body2" className="text-neutral-500">
        {t('logo.help')}
      </Typography>
    </section>
  );
};

export default LogoSection;
