import { CookieOptions, createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import { createClient } from './server';

interface MockSupabaseClient {
  url: string;
  key: string;
  __testConfig: {
    cookies: {
      getAll: () => ReturnType<typeof mockGetAll>;
      setAll: (
        cookiesToSet: Array<{
          name: string;
          value: string;
          options: CookieOptions;
        }>
      ) => void;
    };
  };
}

const mockSet = vi.fn();
const mockGetAll = vi.fn(() => [{ name: 'sb-access-token', value: 'xyz' }]);

const mockCookieStore = {
  getAll: mockGetAll,
  set: mockSet,
};

vi.mock('next/headers', () => ({
  cookies: vi.fn(async () => mockCookieStore),
}));

vi.mock('@supabase/ssr', () => ({
  createServerClient: vi.fn((url, key, config) => {
    return {
      __testConfig: config,
      url,
      key,
    };
  }),
}));

describe('Supabase createClient Server Utility', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.clearAllMocks();
    process.env = {
      ...originalEnv,
      NEXT_PUBLIC_SUPABASE_URL: 'https://supabase.co',
      NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: 'fake-anon-key',
    };
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    process.env = originalEnv;
    vi.restoreAllMocks();
  });

  it('should initialize createServerClient with correct env variables', async () => {
    await createClient();

    expect(createServerClient).toHaveBeenCalledWith(
      'https://supabase.co',
      'fake-anon-key',
      expect.any(Object)
    );
  });

  it('should correctly proxy getAll() calls to Next.js cookieStore', async () => {
    const client = (await createClient()) as unknown as MockSupabaseClient;

    const result = client.__testConfig.cookies.getAll();

    expect(cookies).toHaveBeenCalled();
    expect(mockGetAll).toHaveBeenCalledTimes(1);
    expect(result).toEqual([{ name: 'sb-access-token', value: 'xyz' }]);
  });

  it('should loop and call cookieStore.set() for each cookie in setAll()', async () => {
    const client = (await createClient()) as unknown as MockSupabaseClient;

    const cookiesToSet = [
      { name: 'cookie1', value: 'val1', options: { path: '/' } },
      { name: 'cookie2', value: 'val2', options: { path: '/' } },
    ];

    client.__testConfig.cookies.setAll(cookiesToSet);

    expect(mockSet).toHaveBeenCalledTimes(2);
    expect(mockSet).toHaveBeenNthCalledWith(1, 'cookie1', 'val1', {
      path: '/',
    });
    expect(mockSet).toHaveBeenNthCalledWith(2, 'cookie2', 'val2', {
      path: '/',
    });
  });

  it('should safely catch and log errors in setAll() if cookie mutation is forbidden by Next.js', async () => {
    const client = (await createClient()) as unknown as MockSupabaseClient;

    mockSet.mockImplementation(() => {
      throw new Error(
        'Next.js Error: Cookies can only be modified in a Server Action'
      );
    });

    const cookiesToSet = [{ name: 'token', value: '123', options: {} }];

    expect(() => {
      client.__testConfig.cookies.setAll(cookiesToSet);
    }).not.toThrow();

    expect(console.error).toHaveBeenCalledWith(
      'Failed to set cookies',
      expect.any(Error)
    );
  });
});
