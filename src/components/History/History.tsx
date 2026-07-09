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
    <div>
      <h2>History and analytics:</h2>
      <ul>
        {history.map((item) => {
          return (
            <li key={item.id}>
              <Link href={`?details=${item.id}`} scroll={false}>
                <div>{trimUrl(item.URL)}</div>
                <div>{item.endpoint}</div>
                <div>{item.requestMethod}</div>
                <div>details &gt;&gt; </div>
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
