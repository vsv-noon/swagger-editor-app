import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

import styles from './about.module.scss';

export default function About() {
  const t = useTranslations('About');
  return (
    <div>
      <div className={styles.cardWrapper}>
        <div className={styles.card}>
          <div className={styles.profilePicture} />
          <div className={styles.discription}>
            <h3>{t('name-v')}</h3>
            <p>{t('role-2')}</p>
          </div>
          <div className={styles.git}>
            <p>
              Github:
              <a href="https://github.com/vsv-noon" className={styles.gitLink}>
                vsv-noon
              </a>
            </p>
          </div>
        </div>
        <div className={styles.card}>
          <div className={styles.profilePicture} />
          <div className={styles.discription}>
            <h3>{t('name-n')}</h3>
            <p>{t('role-1')}</p>
          </div>
          <div className={styles.git}>
            <p>
              Github:
              <a
                href="https://github.com/nastya-student"
                className={styles.gitLink}
              >
                nastya-student
              </a>
            </p>
          </div>
        </div>
        <div className={styles.card}>
          <div className={styles.profilePicture} />
          <div className={styles.discription}>
            <h3>{t('name-k')}</h3>
            <p>{t('role-2')}</p>
          </div>
          <div className={styles.git}>
            <p>
              Github:
              <a
                href="https://github.com/katehalitsa"
                className={styles.gitLink}
              >
                katehalitsa
              </a>
            </p>
          </div>
        </div>
      </div>
      <div className={styles.rsSchool}>
        <Link href="https://rs.school/courses/reactjs" target="_blank">
          <Image
            src="/about-pictures/logo.png"
            alt="Rs-school"
            width={200}
            height={200}
            className={styles.logo}
          />
        </Link>
        <div className={styles.tooltip}>
          <p>{t('info')}</p>
        </div>
      </div>
    </div>
  );
}
