import { useTranslations } from 'next-intl';

import { Link } from '@/i18n/navigation';

import styles from './Footer.module.scss';

const Footer = () => {
  const t = useTranslations('Footer');

  return (
    <footer className={styles.footer}>
      <Link className={styles.link} href="/about">
        {t('about')}
      </Link>
      <div>2026</div>
      <Link className={styles.link} href="https://rs.school/">
        RS School
      </Link>
    </footer>
  );
};

export default Footer;
