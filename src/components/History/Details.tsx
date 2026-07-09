import { useRouter } from '@/i18n/navigation';

import { HistoryResponse } from './History';
import style from './History.module.scss';
import { parseObjectKeys } from './utils';

type DetailsProps = {
  requestItem: HistoryResponse;
};

const Details: React.FC<DetailsProps> = ({ requestItem }) => {
  const router = useRouter();
  const closeDetails = () => {
    router.back();
  };

  const entries = Object.entries(requestItem).map((item) =>
    parseObjectKeys(item)
  );
  return (
    <div onClick={closeDetails}>
      <h2>Details</h2>
      {entries.map((entry, index) => {
        return (
          <div key={index}>
            {entry[0]}: {entry[1]}
          </div>
        );
      })}
      <button>Close</button>
    </div>
  );
};

export default Details;
