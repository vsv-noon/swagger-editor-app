import { NextRequest } from 'next/server';
import createMiddleware from 'next-intl/middleware';

import { routing } from './i18n/routing';
import { updateSession } from './utils/supabase/proxy';

const handleI18nRouting = createMiddleware(routing);

export async function proxy(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  if (pathname === '/' || pathname === '/ru' || pathname === '/en') {
    return handleI18nRouting(req);
  }
  const response = handleI18nRouting(req);

  const supabaseResponse = await updateSession(req);

  if (
    supabaseResponse.headers.get('x-middleware-redirect') ||
    (supabaseResponse.status >= 300 && supabaseResponse.status < 400)
  ) {
    return supabaseResponse;
  }

  supabaseResponse.cookies.getAll().forEach((cookie) => {
    response.cookies.set(cookie.name, cookie.value);
  });

  return response;
}

export const config = {
  matcher: '/((?!api|trpc|_next|_vercel|.*\\..*).*)',
};
