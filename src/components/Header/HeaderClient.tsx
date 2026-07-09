'use client';

import { Suspense } from 'react';

import { User } from '@supabase/supabase-js';
import { useParams, usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';

import { Link } from '@/i18n/navigation';

import LocaleSwitcher from '../LocaleSwitcher';

import AuthComponent from './AuthComponent';
import styles from './Header.module.scss';

export type HeaderProps = {
  user: User | null;
};

const HeaderClient: React.FC<HeaderProps> = ({ user }) => {
  const pathname = usePathname();
  const params = useParams();
  const locale = params?.locale;

  const isAbout = pathname?.includes('/about');
  const isHistory = pathname?.includes('/history');
  const isHome = pathname === '/' || pathname === `/${locale}`;

  const t = useTranslations('Header');

  return (
    <header className={styles.header}>
      <Suspense>
        <LocaleSwitcher />
      </Suspense>
      <nav className={styles.headerNav}>
        <div className={styles.navLeft}>
          {!isAbout && (
            <Link className={styles.link} href={`/about`}>
              {t('about')}
            </Link>
          )}
          {!isHome && (
            <Link className={styles.link} href={`/`}>
              {t('home')}
            </Link>
          )}
        </div>
        <div className={styles.navRight}>
          {user && !isHistory && (
            <Link className={styles.link} href={`/history`}>
              {t('history')}
            </Link>
          )}

          <AuthComponent user={user}></AuthComponent>
        </div>
      </nav>
    </header>
  );
};

export default HeaderClient;
