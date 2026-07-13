import { NextRequest, NextResponse } from 'next/server';
import { expect, it, vi } from 'vitest';

import { POST } from './route';

const insert = vi.fn().mockResolvedValue({
  data: [],
  error: null,
});

const select = vi.fn().mockResolvedValue({
  data: [],
  error: null,
});

const getUser = vi.fn().mockResolvedValue({
  data: {
    user: { id: '123' },
  },
});

vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(async () => ({
    auth: {
      getUser,
    },
    from: vi.fn(() => ({
      insert,
      select,
    })),
  })),
}));
global.fetch = vi.fn().mockResolvedValue({
  status: 200,
  text: vi.fn().mockResolvedValue('{"ok":true}'),
  headers: {
    get: vi.fn(() => 'application/json'),
    entries: () => [['content-type', 'application/json']],
  },
});
const request = new NextRequest('http://localhost/api/execute', {
  method: 'POST',
  body: JSON.stringify({
    server: 'https://api.test.com',
    path: '/users/{id}',
    method: 'post',
    pathParams: { id: '5' },
    queryParams: { page: '2' },
    headers: { Authorization: 'token' },
    body: { name: 'Kate' },
    isBinary: false,
  }),
});
it('testPOST', async () => {
  const response = await POST(request);
  expect(fetch).toHaveBeenCalledWith(
    'https://api.test.com/users/5?page=2',
    expect.objectContaining({
      method: 'POST',
      headers: {
        Authorization: 'token',
      },
      body: {
        name: 'Kate',
      },
    })
  );
});
it('handles fetch error', async () => {
  vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('Network error')));

  const request = new NextRequest('http://localhost/api/execute', {
    method: 'POST',
    body: JSON.stringify({
      server: 'https://api.test.com',
      path: '/users',
      method: 'get',
      isBinary: false,
    }),
  });

  const response = await POST(request);

  expect(response.status).toBe(500);

  const body = await response.json();

  expect(body.error.message).toBe('Failed to connect to server');
  expect(body.error.details).toContain('Network error');
});
