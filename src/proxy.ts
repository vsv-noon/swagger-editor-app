import { NextRequest } from 'next/server';
import createMiddleware from 'next-intl/middleware';

import { routing } from './i18n/routing';
import { updateSession } from './lib/supabase/proxy';

const handleI18nRouting = createMiddleware(routing);

export async function proxy(req: NextRequest) {
  const supabaseResponse = await updateSession(req);

  const isRedirected =
    supabaseResponse.headers.get('x-middleware-redirect') ||
    (supabaseResponse.status >= 300 && supabaseResponse.status < 400);

  if (isRedirected) {
    return supabaseResponse;
  }

  const response = handleI18nRouting(req);

  supabaseResponse.cookies.getAll().forEach((cookie) => {
    response.cookies.set(cookie.name, cookie.value);
  });

  return response;
}

export const config = {
  matcher: '/((?!api|trpc|_next|_vercel|.*\\..*).*)',
};
