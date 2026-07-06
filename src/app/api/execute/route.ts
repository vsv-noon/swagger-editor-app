import { NextRequest, NextResponse } from 'next/server';

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

  const res = await fetch(url, {
    method: m,
    headers: finalHeaders,
    body: hasBody ? (isBinary ? body : body) : undefined,
  });

  const text = await res.text();

  let parsed: unknown = text;
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
