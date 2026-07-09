import History from '@/components/History/History';
import { createClient } from '@/lib/supabase/server';

const HistoryPage = async () => {
  const supabase = createClient();
  const { data } = await (await supabase).from('requests_history').select('*');

  if (!data) {
    return [];
  }

  const clearResponse = data.map((responseItem) => {
    const {
      request_duration,
      response_status_code,
      created_at,
      request_method,
      request_size,
      response_size,
      error_details,
      endpoint,
      URL,
      id,
      user_id,
    } = responseItem;
    return {
      requestDuration: request_duration,
      statusCode: response_status_code,
      requestTimestamp: created_at,
      requestMethod: request_method,
      requestSize: request_size,
      responseSize: response_size,
      errorDetails: error_details,
      endpoint: endpoint,
      URL: URL,
      id: id,
    };
  });

  return <History history={clearResponse}></History>;
};

export default HistoryPage;
