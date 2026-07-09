import { createBrowserClient } from '@supabase/ssr';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

vi.mock('@supabase/ssr', () => ({
  createBrowserClient: vi.fn(() => ({
    auth: {},
    from: vi.fn(),
  })),
}));

describe('Supabase createClient Browser Utility', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.clearAllMocks();
    vi.resetModules();

    process.env = {
      ...originalEnv,
      NEXT_PUBLIC_SUPABASE_URL: 'https://browser-fake-url.supabase.co',
      NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: 'browser-fake-anon-key',
    };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it('should call createBrowserClient with the correct environment variables', async () => {
    const { createClient } = await import('./client');

    const client = createClient();

    expect(createBrowserClient).toHaveBeenCalledWith(
      'https://browser-fake-url.supabase.co',
      'browser-fake-anon-key'
    );
    expect(client).toBeDefined();
  });

  it('should use updated environment variables if they change', async () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://new-url.supabase.co';
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY = 'new-key';

    const { createClient } = await import('./client');

    createClient();

    expect(createBrowserClient).toHaveBeenCalledWith(
      'https://new-url.supabase.co',
      'new-key'
    );
  });
});
