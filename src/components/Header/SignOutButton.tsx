'use client';

import { User } from '@supabase/supabase-js';
import { useTranslations } from 'next-intl';

import { useRouter } from '@/i18n/navigation';
import { createClient } from '@/lib/supabase/client';

import styles from './Header.module.scss';

export type AuthProps = {
  user: User | null;
};

const SignOutButton: React.FC<AuthProps> = ({ user }) => {
  const supabase = createClient();
  const router = useRouter();
  const t = useTranslations('AuthComponent');

  const onSignOut = async () => {
    supabase.auth.signOut().then(() => {
      router.refresh();
    });
  };

  return (
    <div className={styles.headerButtons}>
      {user && (
        //   <>
        //     <Link
        //       href="/auth/signin"
        //       className={`${styles.signInButton} ${styles.button}`}
        //     >
        //       {t('signIn')}
        //     </Link>
        //     <Link
        //       href="/auth/signup"
        //       className={`${styles.signUpButton} ${styles.button}`}
        //     >
        //       {t('signUp')}
        //     </Link>
        //   </>
        // ) : (
        //   <>
        <button
          className={`${styles.signOutButton} ${styles.button}`}
          onClick={onSignOut}
        >
          {t('signOut')}
        </button>
        // </>
      )}
    </div>
  );
};
export default SignOutButton;
