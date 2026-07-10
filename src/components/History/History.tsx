'use client';

import { useSearchParams } from 'next/navigation';

import { Link } from '@/i18n/navigation';

import Details from './Details';
import styles from './History.module.scss';
import { trimUrl } from './utils';

export type HistoryResponse = {
  requestDuration: string;
  statusCode: string;
  requestTimestamp: string;
  requestMethod: string;
  requestSize: string;
  responseSize: string;
  errorDetails: string;
  endpoint: string;
  URL: string;
  id: string;
};

type HistoryProps = {
  history: HistoryResponse[];
};

const History: React.FC<HistoryProps> = ({ history }) => {
  const searchParams = useSearchParams();

  const details = searchParams?.get('details');

  if (history.length === 0) {
    return <div>You haven&apos;t executed any requests yet</div>;
  }
  return (
    <div className={styles.historyWrapper}>
      <h2>History and analytics:</h2>
      <ul className={styles.historyList}>
        {history.map((item) => {
          return (
            <li className={styles.historyItem} key={item.id}>
              <Link
                className={styles.historyLink}
                href={`?details=${item.id}`}
                scroll={false}
              >
                <div>{trimUrl(item.URL)}</div>
                <div>{item.endpoint}</div>
                <div>{item.requestMethod}</div>
                <div className={styles.historyDetailsPointer}>
                  details &gt;&gt;{' '}
                </div>
              </Link>
              {details === String(item.id) && (
                <Details requestItem={item}></Details>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
};
export default History;
