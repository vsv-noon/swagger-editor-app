import { getTranslations } from 'next-intl/server';

import { routing } from '@/i18n/routing';

import styles from './HistoryAndAnalytics.module.scss';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function HistoryAndAnalytics() {
  const t = await getTranslations('History');

  return (
    <div className={styles.historyContainer}>
      <h1>{t('title')}</h1>

      <p>{t('text')}</p>
    </div>
  );
}
