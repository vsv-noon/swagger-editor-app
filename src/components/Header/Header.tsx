import { createClient } from '@/utils/supabase/server';

import HeaderClient from './HeaderClient';

const Header = async () => {
  const supabaseClient = await createClient();
  const {
    data: { user },
    error,
  } = await supabaseClient.auth.getUser();
  return <HeaderClient user={user}></HeaderClient>;
};

export default Header;
