'use client';

import { User } from '@supabase/supabase-js';

import { Link } from '@/i18n/navigation';

import styles from './Header.module.scss';

export type AuthProps = {
  user: User | null;
};

const AuthComponent: React.FC<AuthProps> = ({ user }) => {
  return (
    <div className={styles.headerButtons}>
      {user === null ? (
        <>
          <Link
            href="/signin"
            className={`${styles.signInButton} ${styles.button}`}
          >
            Sign In
          </Link>
          <Link
            href="/signup"
            className={`${styles.signUpButton} ${styles.button}`}
          >
            Sign Up
          </Link>
        </>
      ) : (
        <>
          <button className={`${styles.signOutButton} ${styles.button}`}>
            Sign Out
          </button>
        </>
      )}
    </div>
  );
};
export default AuthComponent;
