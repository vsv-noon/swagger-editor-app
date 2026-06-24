import styles from './Loader.module.scss';

export type LoaderProps = {
  variant: 'fullscreen' | 'overlay';
};
const Loader: React.FC<LoaderProps> = ({ variant }) => {
  const className = `${styles.loaderContainer} ${variant === 'fullscreen' ? styles.loaderFullscreen : styles.loaderOverlay}`;

  return (
    <div className={className}>
      <div className={styles.spinner} role="status" aria-label="Loading"></div>
    </div>
  );
};

export default Loader;
