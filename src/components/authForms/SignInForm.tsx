import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { Controller, useForm } from 'react-hook-form';

import { useRouter } from '@/i18n/navigation';
import { createClient } from '@/lib/supabase/client';

import styles from './AuthForms.module.scss';
import { AuthInput } from './AuthInput';
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
        <AuthInput
          control={control}
          name="email"
          id="signIn-email"
          type="email"
          htmlFor="signIn-email"
          label="email"
        ></AuthInput>
        <AuthInput
          control={control}
          name="password"
          id="signIn-password"
          type="password"
          htmlFor="signIn-password"
          label="password"
        ></AuthInput>
      </div>
      <div className={styles.authPasswordChecker}></div>

      <button className={styles.authSubmitBtn} disabled={isSubmitting}>
        {t('signIn')}
      </button>
    </form>
  );
};

export default SignInForm;
