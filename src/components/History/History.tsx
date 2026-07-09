'use client';

import { useSearchParams } from 'next/navigation';

import { Link } from '@/i18n/navigation';

import Details from './Details';
import styles from './History.module.scss';

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

  const openDetails = searchParams?.get('openDetails');

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
              <Link href={'?openDetails=true'} scroll={false}>
                {item.requestMethod} {item.URL}/{item.endpoint}
              </Link>
              {openDetails === 'true' && <Details requestItem={item}></Details>}
            </li>
          );
        })}
      </ul>
    </div>
  );
};
export default History;
