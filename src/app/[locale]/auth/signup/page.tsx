'use client';

import SignUpForm from '@/components/authForms/SignUpForm';

import styles from '../auth.module.scss';

const SignUp = () => {
  return (
    <div className={styles.authFormWrapper}>
      <SignUpForm></SignUpForm>
    </div>
  );
};

export default SignUp;
