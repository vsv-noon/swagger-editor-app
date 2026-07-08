import { Link } from '@/i18n/navigation';

import styles from './Footer.module.scss';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <Link className={styles.link} href="/about">
        About
      </Link>
      <div>2026</div>
      <Link className={styles.link} href="https://rs.school/">
        RS School
      </Link>
    </footer>
  );
};

export default Footer;
