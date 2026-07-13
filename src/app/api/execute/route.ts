import { NextRequest, NextResponse } from 'next/server';

import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  const {
    server,
    path,
    method,
    pathParams,
    queryParams,
    headers,
    body,
    isBinary,
  } = await request.json();

  let url = server + path;

  if (pathParams) {
    for (const [key, value] of Object.entries(pathParams)) {
      url = url.replace(`{${key}}`, encodeURIComponent(String(value ?? '')));
    }
  }

  const search = new URLSearchParams();
  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== undefined && value !== null && String(value) !== '') {
        search.append(key, String(value));
      }
    }
  }
  const qs = search.toString();
  if (qs) url += `?${qs}`;

  const finalHeaders: Record<string, string> = {
    ...(headers ?? {}),
  };

  const m = method.toUpperCase();
  const hasBody = !(m === 'GET' || m === 'HEAD' || m === 'DELETE');

  const requestTimestamp = new Date().toISOString();
  const requestBody =
    hasBody && body
      ? typeof body === 'string'
        ? body
        : JSON.stringify(body)
      : '';

  const requestSize = new TextEncoder().encode(requestBody).length;
  const startedAt = performance.now();

  let res: Response | null = null;
  let text = '';
  let responseSize = 0;
  let duration = 0;
  let errorDetails: {
    message: string;
    stack: string | null;
  } | null = null;

  try {
    res = await fetch(url, {
      method: m,
      headers: finalHeaders,
      body: hasBody ? body : undefined,
    });

    duration = Math.round(performance.now() - startedAt);

    text = await res.text();
    responseSize = new TextEncoder().encode(text).length;
  } catch (error) {
    duration = Math.round(performance.now() - startedAt);

    errorDetails = {
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? (error.stack ?? null) : null,
    };
  }

  const supabaseClient = await createClient();
  const {
    data: { user },
  } = await supabaseClient.auth.getUser();

  const { data, error } = await supabaseClient.from('requests_history').insert([
    {
      request_duration: duration,
      response_status_code: res?.status ?? null,
      request_method: m,
      request_size: requestSize,
      response_size: responseSize,
      endpoint: path,
      error_details: errorDetails ? JSON.stringify(errorDetails) : null,
      user_id: user?.id ?? null,
      URL: url,
    },
  ]);

  let parsed: unknown = text;
  if (!res) {
    return NextResponse.json(
      {
        error: {
          message: 'Failed to connect to server',
          details: errorDetails?.message ?? 'Unknown error',
        },
      },
      { status: 500 }
    );
  }
  const contentType = res.headers.get('content-type') ?? '';
  if (contentType.includes('application/json')) {
    try {
      parsed = JSON.parse(text);
    } catch {
      //
    }
  }

  return NextResponse.json({
    status: res.status,
    headers: Object.fromEntries(res.headers.entries()),
    body: parsed,
  });
}
