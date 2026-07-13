import { render, screen } from '@testing-library/react';
import { vi, it, expect } from 'vitest';

const getUser = vi.fn();

vi.mock('@/lib/supabase/server', () => ({
  createClient: () => ({
    auth: {
      getUser,
    },
  }),
}));

vi.mock('./HeaderClient', () => ({
  default: ({ user }: { user: { email: string } | null }) => (
    <div>{user?.email ?? 'guest'}</div>
  ),
}));

import Header from './Header';

it('passes user to HeaderClient', async () => {
  getUser.mockResolvedValue({
    data: {
      user: {
        email: 'test@test.com',
      },
    },
  });

  const Component = await Header();

  render(Component);

  expect(screen.getByText('test@test.com')).toBeInTheDocument();
});
