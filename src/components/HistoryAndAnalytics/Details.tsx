import { useTranslations } from 'next-intl';

import { usePathname, useRouter } from '@/i18n/navigation';

import { HistoryResponse } from './HistoryAndAnalytics';
import styles from './HistoryAndAnalytics.module.scss';
import { parseObjectKeys } from './utils';

type DetailsProps = {
  requestItem: HistoryResponse;
};

const Details: React.FC<DetailsProps> = ({ requestItem }) => {
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations('History');

  const closeDetails = () => {
    router.push(pathname);
  };

  const entries = Object.entries(requestItem).map((item) =>
    parseObjectKeys(item)
  );
  return (
    <div className={styles.historyDetails}>
      <h2>{t('details')}</h2>
      <div className={styles.detailsList}>
        {entries.map((entry, index) => {
          if (entry[0] === 'id') {
            return;
          }
          if (entry[0] === 'request') {
            return;
          }
          return (
            <div className={styles.detailsItem} key={index}>
              <div>{t(`${entry[0]}`)}:</div>
              <div>{entry[1]}</div>
            </div>
          );
        })}
      </div>

      <button className={styles.detailsButton} onClick={closeDetails}>
        {t('close')}
      </button>
    </div>
  );
};

export default Details;
