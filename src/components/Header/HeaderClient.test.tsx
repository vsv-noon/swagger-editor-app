import { render, screen, cleanup } from '@testing-library/react';
import { usePathname } from 'next/navigation';
import { afterEach, expect, it, vi } from 'vitest';

import HeaderClient from './HeaderClient';

afterEach(() => {
  cleanup();
});

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}));
type MockLinkProps = React.PropsWithChildren<{
  href: string;
  className?: string;
}>;

vi.mock('@/i18n/navigation', () => ({
  Link: ({ children, href }: MockLinkProps) => <a href={href}>{children}</a>,
}));
vi.mock('../LocaleSwitcher', () => ({
  default: () => <div>locale</div>,
}));
vi.mock('./SignOutButton', () => ({
  default: () => <div>signout</div>,
}));
const getUser = vi.fn();

vi.mock('@/lib/supabase/server', () => ({
  createClient: () => ({
    auth: {
      getUser,
    },
  }),
}));
vi.mock('next/navigation', () => ({
  usePathname: vi.fn(),
}));

const mockedUsePathname = vi.mocked(usePathname);
it('shows guest navigation on home page', async () => {
  mockedUsePathname.mockReturnValue('/en');
  render(<HeaderClient user={null} />);

  expect(screen.queryByText('Home')).not.toBeInTheDocument();
  expect(screen.getByText('About')).toBeInTheDocument();
  expect(screen.getByText('Sign In')).toBeInTheDocument();
  expect(screen.getByText('Sign Up')).toBeInTheDocument();
  expect(screen.queryByText('History')).not.toBeInTheDocument();
});
