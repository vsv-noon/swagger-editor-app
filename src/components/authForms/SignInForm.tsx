import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';

import { useRouter } from '@/i18n/navigation';
import { createClient } from '@/lib/supabase/client';

import styles from './AuthForms.module.scss';
import { signInSchema, SignInInput } from './utils/validation';

const SignInForm = () => {
  const router = useRouter();
  const supabase = createClient();

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<SignInInput>({
    resolver: zodResolver(signInSchema),
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
      <h1 className={styles.authHeader}>Sign In: </h1>
      <div className={styles.authInputsGroup}>
        <Controller
          name="email"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <div className={styles.formItem}>
              <div className={styles.authInputContainer}>
                <label htmlFor="signIn-email">Email:</label>
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
                <label htmlFor="signIn-password">Password:</label>
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
        Enter
      </button>
    </form>
  );
};

export default SignInForm;
