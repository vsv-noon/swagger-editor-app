import History, { HistoryResponse } from '@/components/History/History';
import { createClient } from '@/lib/supabase/server';

const HistoryPage = async () => {
  const supabase = createClient();
  const { data } = await (await supabase).from('requests_history').select('*');

  const response = (data as HistoryResponse[]) ?? [];

  console.log('history-r: ' + response);

  return <History history={response}></History>;
};

export default HistoryPage;
