import { createClient } from '@/lib/supabase/server';

export async function getLatestSchema() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data } = await supabase
    .from('schemas')
    .select('content')
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  return data?.content ?? null;
}
