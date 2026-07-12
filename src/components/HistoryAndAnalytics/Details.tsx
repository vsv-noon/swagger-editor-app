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
  const closeDetails = () => {
    router.push(pathname);
  };

  const entries = Object.entries(requestItem).map((item) =>
    parseObjectKeys(item)
  );
  return (
    <div className={styles.historyDetails}>
      <h2>Details</h2>
      <div className={styles.detailsList}>
        {entries.map((entry, index) => {
          if (entry[0] === 'id') {
            return;
          }
          return (
            <div className={styles.detailsItem} key={index}>
              <div>{entry[0]}:</div>
              <div>{entry[1]}</div>
            </div>
          );
        })}
      </div>

      <button className={styles.detailsButton} onClick={closeDetails}>
        Close
      </button>
    </div>
  );
};

export default Details;
