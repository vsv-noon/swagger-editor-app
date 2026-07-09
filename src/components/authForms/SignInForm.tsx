import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { Controller, useForm } from 'react-hook-form';

import { useRouter } from '@/i18n/navigation';
import { createClient } from '@/lib/supabase/client';

import styles from './AuthForms.module.scss';
import { signInSchema, SignInInput } from './utils/validation';

const SignInForm = () => {
  const router = useRouter();
  const supabase = createClient();
  const t = useTranslations('SignForm');

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<SignInInput>({
    resolver: zodResolver(signInSchema),
    mode: 'onChange',
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: SignInInput) => {
    supabase.auth.signInWithPassword(data).then(() => {
      router.push('/');
      router.refresh();
    });
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={styles.authForm}
      noValidate
    >
      <h1 className={styles.authHeader}>{t('signIn')}: </h1>
      <div className={styles.authInputsGroup}>
        <Controller
          name="email"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <div className={styles.formItem}>
              <div className={styles.authInputContainer}>
                <label htmlFor="signIn-email">{t('email')}:</label>
                <input
                  id="signIn-email"
                  type="email"
                  className={styles.authInput}
                  required
                  {...field}
                ></input>
              </div>
              {error && (
                <span className={styles.authErrorMsg}>{error.message}</span>
              )}
            </div>
          )}
        ></Controller>

        <Controller
          name="password"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <div className={styles.formItem}>
              <div className={styles.authInputContainer}>
                <label htmlFor="signIn-password">{t('password')}:</label>
                <input
                  id="signIn-password"
                  type="password"
                  className={styles.authInput}
                  required
                  {...field}
                ></input>
              </div>
              {error && (
                <span className={styles.authErrorMsg}>{error.message}</span>
              )}
            </div>
          )}
        ></Controller>
      </div>
      <div className={styles.authPasswordChecker}></div>

      <button className={styles.authSubmitBtn} disabled={isSubmitting}>
        {t('signIn')}
      </button>
    </form>
  );
};

export default SignInForm;
