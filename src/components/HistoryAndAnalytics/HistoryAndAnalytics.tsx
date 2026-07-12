'use client';

import { useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';

import { Link } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';

import Details from './Details';
import styles from './HistoryAndAnalytics.module.scss';
import { trimUrl } from './utils';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

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

const HistoryAndAnalytics: React.FC<HistoryProps> = ({ history }) => {
  const t = useTranslations('History');

  const searchParams = useSearchParams();

  const details = searchParams?.get('details');

  if (history.length === 0) {
    return <div>You haven&apos;t executed any requests yet</div>;
  }
  return (
    <div className={styles.historyWrapper}>
      <h2>{t('title')}</h2>
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
export default HistoryAndAnalytics;
