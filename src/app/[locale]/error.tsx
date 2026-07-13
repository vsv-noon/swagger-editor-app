'use client';

import { useEffect } from 'react';

import Image from 'next/image';
import { useTranslations } from 'next-intl';

import errorImage from '@/assets/error.png';

import styles from './error.module.scss';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations('ErrorBoundary');

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className={styles.errorBoundary}>
      <h1 className={styles.title}>{t('title')}</h1>
      <Image src={errorImage} alt="error" width={300} height={300} priority />

      <button className={styles.button} onClick={() => reset()}>
        {t('button')}
      </button>
    </div>
  );
}
