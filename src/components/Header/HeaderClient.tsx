'use client';

import { Suspense } from 'react';

import { User } from '@supabase/supabase-js';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';

import { PATHS } from '@/constants/paths';
import { Link } from '@/i18n/navigation';

import LocaleSwitcher from '../LocaleSwitcher';

import styles from './Header.module.scss';
import SignOutButton from './SignOutButton';

export type HeaderProps = {
  user: User | null;
};

type NavItem = {
  label: string;
  path: string;
  role: 'user' | 'guest' | 'all';
  availableLinks: string[];
};
const NAVIGATION: NavItem[] = [
  {
    label: 'Home',
    path: '/',
    role: 'all',
    availableLinks: [PATHS.about, PATHS.history, PATHS.signin, PATHS.signup],
  },
  {
    label: 'About',
    path: '/about',
    role: 'all',
    availableLinks: [PATHS.home, PATHS.history, PATHS.signin, PATHS.signup],
  },
  {
    label: 'History',
    path: '/history',
    role: 'user',
    availableLinks: [PATHS.home, PATHS.about],
  },
  {
    label: 'Sign In',
    path: '/auth/signin',
    role: 'guest',
    availableLinks: [PATHS.home, PATHS.about, PATHS.signin, PATHS.signup],
  },
  {
    label: 'Sign Up',
    path: '/auth/signup',
    role: 'guest',
    availableLinks: [PATHS.home, PATHS.about, PATHS.signin, PATHS.signup],
  },
];

const HeaderClient: React.FC<HeaderProps> = ({ user }) => {
  const pathname = usePathname();
  const isAuth = !!user;

  const t = useTranslations('Header');

  return (
    <header className={styles.header}>
      <Suspense>
        <LocaleSwitcher />
      </Suspense>
      <nav className={styles.headerNav}>
        {NAVIGATION.map((item) => {
          const path = '/' + pathname.split('/').slice(2).join('/');
          const isVisible = item.availableLinks.includes(path);
          const isAccessed =
            item.role === 'all' ||
            (item.role === 'guest' && !isAuth) ||
            (item.role === 'user' && isAuth);
          return isVisible && isAccessed ? (
            <Link key={item.path} className={styles.link} href={item.path}>
              {item.label}
            </Link>
          ) : null;
        })}
      </nav>
      <SignOutButton user={user}></SignOutButton>
    </header>
  );
};

export default HeaderClient;
