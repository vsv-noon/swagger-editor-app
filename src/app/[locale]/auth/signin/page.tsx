'use client';

import SignInForm from '@/components/AuthForms/SignInForm';

import styles from '../auth.module.scss';

const SignIn = () => {
  return (
    <div className={styles.authFormWrapper}>
      <SignInForm></SignInForm>
    </div>
  );
};

export default SignIn;
