import { describe, it, expect, vi, beforeEach } from 'vitest';

import { getLatestSchema } from './getSchema';

const mockGetUser = vi.fn();

const mockSupabaseChain = {
  select: vi.fn().mockReturnThis(),
  order: vi.fn().mockReturnThis(),
  limit: vi.fn().mockReturnThis(),
  single: vi.fn(),
};

const mockFrom = vi.fn(() => mockSupabaseChain);

const mockSupabaseClient = {
  auth: {
    getUser: mockGetUser,
  },
  from: mockFrom,
};

vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(async () => mockSupabaseClient),
}));

describe('getLatestSchema Server Function', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return null if user is not authenticated', async () => {
    mockGetUser.mockResolvedValue({ data: { user: null } });

    const result = await getLatestSchema();

    expect(result).toBeNull();
    expect(mockFrom).not.toHaveBeenCalled();
  });

  it('should return content string when latest schema exists', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'user_123' } } });

    mockSupabaseChain.single.mockResolvedValue({
      data: { content: 'openapi: 3.0.0\ninfo:\n  title: Test API' },
      error: null,
    });

    const result = await getLatestSchema();

    expect(mockFrom).toHaveBeenCalledWith('schemas');
    expect(mockSupabaseChain.select).toHaveBeenCalledWith('content');
    expect(mockSupabaseChain.order).toHaveBeenCalledWith('created_at', {
      ascending: false,
    });
    expect(mockSupabaseChain.limit).toHaveBeenCalledWith(1);
    expect(mockSupabaseChain.single).toHaveBeenCalled();

    expect(result).toBe('openapi: 3.0.0\ninfo:\n  title: Test API');
  });

  it('should return null if schema record is not found in database', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'user_123' } } });

    mockSupabaseChain.single.mockResolvedValue({ data: null, error: null });

    const result = await getLatestSchema();

    expect(result).toBeNull();
  });
});
