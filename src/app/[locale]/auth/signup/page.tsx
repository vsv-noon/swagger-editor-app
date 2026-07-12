'use client';

import SignUpForm from '@/components/AuthForms/SignUpForm';

import styles from '../auth.module.scss';

const SignUp = () => {
  return (
    <div className={styles.authFormWrapper}>
      <SignUpForm></SignUpForm>
    </div>
  );
};

export default SignUp;
