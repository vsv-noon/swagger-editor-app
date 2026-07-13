import { User } from '@supabase/supabase-js';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect, it, vi, beforeEach } from 'vitest';

import SignOutButton from './SignOutButton';

const signOut = vi.fn().mockResolvedValue(undefined);
const refresh = vi.fn();

vi.mock('@/lib/supabase/client', () => ({
  createClient: () => ({
    auth: {
      signOut,
    },
  }),
}));

vi.mock('@/i18n/navigation', () => ({
  useRouter: () => ({
    refresh,
  }),
}));

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}));
it('does not render button when user is null', () => {
  render(<SignOutButton user={null} />);

  expect(screen.queryByRole('button')).not.toBeInTheDocument();
});
const user = {
  id: '1',
} as User;
it('renders sign out button', () => {
  render(<SignOutButton user={user} />);

  expect(screen.getByRole('button', { name: 'signOut' })).toBeInTheDocument();
});
it('calls signOut', async () => {
  const userEventSetup = userEvent.setup();

  render(<SignOutButton user={user} />);

  await userEventSetup.click(screen.getByRole('button', { name: 'signOut' }));

  expect(signOut).toHaveBeenCalledTimes(1);
});
