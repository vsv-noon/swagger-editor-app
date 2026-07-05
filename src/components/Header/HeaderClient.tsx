'use client';

import { User } from '@supabase/supabase-js';
import { usePathname } from 'next/navigation';

import { Link } from '@/i18n/navigation';

import AuthComponent from './AuthComponent';
import styles from './Header.module.scss';

export type HeaderProps = {
  user: User | null;
};

const HeaderClient: React.FC<HeaderProps> = ({ user }) => {
  const pathname = usePathname();
  const isAbout = pathname?.includes('/about');
  const isHistory = pathname?.includes('/history');
  return (
    <header className={styles.header}>
      <nav className={styles.headerNav}>
        <div className={styles.navLeft}>
          {isAbout ? (
            <Link className={styles.link} href="/">
              Home
            </Link>
          ) : (
            <Link className={styles.link} href="/about">
              About
            </Link>
          )}
        </div>
        <div className={styles.navRight}>
          {user === null ? (
            <></>
          ) : (
            <>
              {isHistory ? (
                <Link className={styles.link} href="/">
                  Home
                </Link>
              ) : (
                <Link className={styles.link} href="/history">
                  History
                </Link>
              )}
            </>
          )}
          <AuthComponent user={user}></AuthComponent>
        </div>
      </nav>
    </header>
  );
};

export default HeaderClient;
