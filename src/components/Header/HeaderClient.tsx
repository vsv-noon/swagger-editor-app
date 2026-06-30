'use client';

import { User } from '@supabase/supabase-js';
import { usePathname } from 'next/navigation';

import { Link } from '@/i18n/navigation';

import styles from './Header.module.scss';

export type HeaderProps = {
  user: User | null;
};

const HeaderClient: React.FC<HeaderProps> = ({ user }) => {
  const pathname = usePathname();
  const isAbout = pathname.includes('/about');
  const isHistory = pathname.includes('/history');
  if (!user) {
    return (
      <header className={styles.header}>
        <nav className={styles.headerNav}>
          {isAbout ? (
            <Link className={styles.link} href="/">
              Home
            </Link>
          ) : (
            <Link className={styles.link} href="/about">
              About
            </Link>
          )}
        </nav>
        <div className={styles.headerButtons}>
          <button className={`${styles.signInButton} ${styles.button}`}>
            Sign In
          </button>
          <button className={`${styles.signUpButton} ${styles.button}`}>
            Sign Up
          </button>
        </div>
      </header>
    );
  }
  return (
    <header className={styles.header}>
      <nav className={styles.headerNav}>
        {isAbout ? (
          <Link className={styles.link} href="/">
            Home
          </Link>
        ) : (
          <Link className={styles.link} href="/about">
            About
          </Link>
        )}

        {isHistory ? (
          <Link className={styles.link} href="/">
            Home
          </Link>
        ) : (
          <Link className={styles.link} href="/history">
            History
          </Link>
        )}
      </nav>
      <div className={styles.headerButtons}>
        <button className={`${styles.signOutButton} ${styles.button}`}>
          Sign Out
        </button>
      </div>
    </header>
  );
};

export default HeaderClient;
