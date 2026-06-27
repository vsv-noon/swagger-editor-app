import styles from './Header.module.scss';

export type HeaderProps = {
  isAuthenticated: boolean;
};

const Header: React.FC<HeaderProps> = ({ isAuthenticated }) => {
  if (!isAuthenticated) {
    return (
      <header className={styles.header}>
        <nav className={styles.headerNav}>
          <a>About</a>
        </nav>
        <div className={styles.headerButtons}>
          <button className={`${styles.signInButton} ${styles.button}`}>
            Sign In
          </button>
          <button className={`${styles.signUpButton} ${styles.button}`}>
            Sign Up
          </button>
        </div>
      </header>
    );
  }
  return <header></header>;
};

export default Header;
