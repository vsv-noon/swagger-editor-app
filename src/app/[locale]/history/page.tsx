import { redirect } from 'next/navigation';

import { createClient } from '@/utils/supabase/client';

const HistoryPage = async () => {
  const supabaseClient = createClient();
  const {
    data: { user },
  } = await supabaseClient.auth.getUser();
  if (!user) {
    redirect('/');
  }
  return <div>History Page</div>;
};

export default HistoryPage;
