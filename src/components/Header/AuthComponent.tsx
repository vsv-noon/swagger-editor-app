'use client';

import { User } from '@supabase/supabase-js';

import { Link, useRouter } from '@/i18n/navigation';
import { createClient } from '@/lib/supabase/client';

import styles from './Header.module.scss';

export type AuthProps = {
  user: User | null;
};

const AuthComponent: React.FC<AuthProps> = ({ user }) => {
  const supabase = createClient();
  const router = useRouter();

  const onSignOut = async () => {
    supabase.auth.signOut().then(() => {
      router.refresh();
    });
  };

  return (
    <div className={styles.headerButtons}>
      {user === null ? (
        <>
          <Link
            href="/auth/signin"
            className={`${styles.signInButton} ${styles.button}`}
          >
            Sign In
          </Link>
          <Link
            href="/auth/signup"
            className={`${styles.signUpButton} ${styles.button}`}
          >
            Sign Up
          </Link>
        </>
      ) : (
        <>
          <button
            className={`${styles.signOutButton} ${styles.button}`}
            onClick={onSignOut}
          >
            Sign Out
          </button>
        </>
      )}
    </div>
  );
};
export default AuthComponent;
