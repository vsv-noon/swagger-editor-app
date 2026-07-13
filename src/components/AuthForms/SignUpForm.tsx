import { useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';

import { useRouter } from '@/i18n/navigation';
import { createClient } from '@/lib/supabase/client';

import styles from './AuthForms.module.scss';
import { AuthInput } from './AuthInput';
import { signUpSchema, SignUpInput } from './utils/validation';

const SignUpForm = () => {
  const router = useRouter();
  const supabase = createClient();
  const t = useTranslations('SignForm');
  const [error, setError] = useState('');

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<SignUpInput>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: SignUpInput) => {
    const { error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          name: data.name,
        },
      },
    });

    if (error) {
      setError(error.message);
      return;
    }
    router.push('/');
    router.refresh();
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={styles.authForm}
      noValidate
    >
      <h1 className={styles.authHeader}>{t('signUp')}: </h1>
      <div className={styles.authInputsGroup}>
        <AuthInput
          control={control}
          name="name"
          id="signUp-name"
          type="name"
          htmlFor="signUp-name"
          label="name"
        ></AuthInput>
        <AuthInput
          control={control}
          name="email"
          id="signUp-email"
          type="email"
          htmlFor="signUp-email"
          label="email"
        ></AuthInput>
        <AuthInput
          control={control}
          name="password"
          id="signUp-password"
          type="password"
          htmlFor="signUp-password"
          label="password"
        ></AuthInput>
      </div>

      {error ? <div className={styles.authErrorMsg}>{error}</div> : <div></div>}

      <button className={styles.authSubmitBtn} disabled={isSubmitting}>
        {t('signUp')}
      </button>
    </form>
  );
};

export default SignUpForm;
