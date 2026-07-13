'use client';

import { Suspense, useEffect, useState } from 'react';

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
    label: 'home',
    path: '/',
    role: 'all',
    availableLinks: [PATHS.about, PATHS.history, PATHS.signin, PATHS.signup],
  },
  {
    label: 'about',
    path: '/about',
    role: 'all',
    availableLinks: [PATHS.home, PATHS.history, PATHS.signin, PATHS.signup],
  },
  {
    label: 'history',
    path: '/history',
    role: 'user',
    availableLinks: [PATHS.home, PATHS.about],
  },
  {
    label: 'signIn',
    path: '/auth/signin',
    role: 'guest',
    availableLinks: [PATHS.home, PATHS.about, PATHS.signin, PATHS.signup],
  },
  {
    label: 'signUp',
    path: '/auth/signup',
    role: 'guest',
    availableLinks: [PATHS.home, PATHS.about, PATHS.signin, PATHS.signup],
  },
];

const HeaderClient: React.FC<HeaderProps> = ({ user }) => {
  const pathname = usePathname();
  const isAuth = !!user;
  const [isScrolled, setIsScrolled] = useState(false);

  const t = useTranslations('Header');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  const path = '/' + pathname.split('/').slice(2).join('/');

  const visibleItems = NAVIGATION.filter((item) => {
    const isVisible = item.availableLinks.includes(path);
    const isAccessed =
      item.role === 'all' ||
      (item.role === 'guest' && !isAuth) ||
      (item.role === 'user' && isAuth);

    return isVisible && isAccessed;
  });

  const mainLinks = visibleItems.filter((item) => item.role !== 'guest');

  const authLinks = visibleItems.filter((item) => item.role === 'guest');
  return (
    <header className={`${styles.header} ${isScrolled && styles.scrolled}`}>
      <Suspense>
        <LocaleSwitcher />
      </Suspense>
      <nav className={styles.headerNav}>
        <div className={styles.mainLinks}>
          {mainLinks.map((item) => (
            <Link key={item.path} className={styles.link} href={item.path}>
              {t(item.label)}
            </Link>
          ))}
        </div>

        <div className={styles.authLinks}>
          {authLinks.map((item) => (
            <Link key={item.path} className={styles.link} href={item.path}>
              {t(item.label)}
            </Link>
          ))}
        </div>
      </nav>
      <SignOutButton user={user}></SignOutButton>
    </header>
  );
};

export default HeaderClient;
