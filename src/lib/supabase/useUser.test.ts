import { User, Session, AuthChangeEvent } from '@supabase/supabase-js';
import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import { useUser } from './useUser';

const mockUnsubscribe = vi.fn();
const mockGetUser = vi.fn();
const mockOnAuthStateChange = vi.fn();

const mockSupabaseClient = {
  auth: {
    getUser: mockGetUser,
    onAuthStateChange: mockOnAuthStateChange,
  },
};

vi.mock('./client', () => ({
  createClient: vi.fn(() => mockSupabaseClient),
}));

describe('useUser Hook', () => {
  const mockFakeUser = {
    id: 'user_abc_123',
    email: 'test@example.com',
  } as User;

  beforeEach(() => {
    vi.clearAllMocks();

    mockGetUser.mockResolvedValue({ data: { user: null }, error: null });

    mockOnAuthStateChange.mockReturnValue({
      data: {
        subscription: { unsubscribe: mockUnsubscribe },
      },
    });
  });

  it('should initially return null and then update with the user from getUser()', async () => {
    mockGetUser.mockResolvedValue({
      data: { user: mockFakeUser },
      error: null,
    });

    const { result } = renderHook(() => useUser());

    expect(result.current).toBeNull();

    await waitFor(() => {
      expect(result.current).toEqual(mockFakeUser);
    });

    expect(mockGetUser).toHaveBeenCalledTimes(1);
    expect(mockOnAuthStateChange).toHaveBeenCalledTimes(1);
  });

  it('should update user state when auth state changes (onAuthStateChange)', async () => {
    let triggerAuthChange: (
      event: AuthChangeEvent,
      session: Session | null
    ) => void = () => {};

    mockOnAuthStateChange.mockImplementation((callback) => {
      triggerAuthChange = callback;
      return { data: { subscription: { unsubscribe: mockUnsubscribe } } };
    });

    const { result } = renderHook(() => useUser());

    await waitFor(() => expect(result.current).toBeNull());

    triggerAuthChange('SIGNED_IN', {
      user: mockFakeUser,
      access_token: '',
      refresh_token: '',
      expires_in: 0,
      token_type: 'bearer',
    });

    await waitFor(() => {
      expect(result.current).toEqual(mockFakeUser);
    });

    triggerAuthChange('SIGNED_OUT', null);

    await waitFor(() => {
      expect(result.current).toBeNull();
    });
  });

  it('should unsubscribe from auth changes when unmounted', async () => {
    const { unmount } = renderHook(() => useUser());

    unmount();

    expect(mockUnsubscribe).toHaveBeenCalledTimes(1);
  });
});
