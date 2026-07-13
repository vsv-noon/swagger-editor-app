export type ExecutePayload = {
  server: string;
  path: string;
  method: string;
  pathParams?: Record<string, string>;
  queryParams?: Record<string, string>;
  params?: Record<string, string | number | boolean | null | undefined>;
  headers?: Record<string, string>;
  isBinary: boolean;
  body?: BodyInit;
};

const NEXT_EXECUTE_URL = '/api/execute';

export async function executeRequest(payload: ExecutePayload) {
  const res = await fetch(NEXT_EXECUTE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(payload.headers ?? {}),
    },
    body: JSON.stringify(payload),
  });

  return res;
}
