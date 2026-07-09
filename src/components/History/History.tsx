'use client';

import { useSearchParams } from 'next/navigation';

import { Link } from '@/i18n/navigation';

import Details from './Details';
import styles from './History.module.scss';

export type HistoryRequest = {
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

const History: React.FC<HistoryRequest[]> = (props: HistoryRequest[]) => {
  const searchParams = useSearchParams();

  const openDetails = searchParams?.get('openDetails');
  return (
    <div>
      <h2>History and analytics:</h2>
      <ul>
        {props.map((item) => {
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
