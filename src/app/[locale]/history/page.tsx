import History, { HistoryResponse } from '@/components/History/History';
import { createClient } from '@/lib/supabase/server';

const HistoryPage = async () => {
  const supabase = createClient();
  const { data } = await (await supabase).from('requests_history').select('*');

  const response = (data as HistoryResponse[]) ?? [];

  const clearResponse = response.map((responseItem) => {
    const { user_id, ...itemsWithoutUserId } = responseItem;
    return itemsWithoutUserId;
  });

  return <History history={clearResponse}></History>;
};

export default HistoryPage;
