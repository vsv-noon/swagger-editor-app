'use client';

import { usePathname } from 'next/navigation';

import { Link } from '@/i18n/navigation';

import styles from './Header.module.scss';

export type HeaderProps = {
  isAuthenticated: boolean;
};

const HeaderClient: React.FC<HeaderProps> = ({ isAuthenticated }) => {
  const pathname = usePathname();
  const isAbout = pathname.includes('/about');
  const isHistory = pathname.includes('/history');
  if (!isAuthenticated) {
    return (
      <header className={styles.header}>
        <nav className={styles.headerNav}>
          {isAbout ? (
            <Link href="/">Home</Link>
          ) : (
            <Link href="/about">About</Link>
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
          <Link href="/">Home</Link>
        ) : (
          <Link href="/about">About</Link>
        )}

        {isHistory ? (
          <Link href="/">Home</Link>
        ) : (
          <Link href="/history">History</Link>
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
