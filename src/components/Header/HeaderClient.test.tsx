/*import { render, screen, cleanup } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";

import HeaderClient from "./HeaderClient";

afterEach(() => {
  cleanup();
});
vi.mock('next/navigation', () => ({
  usePathname: () => '/en/about',
}));
vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}));
vi.mock('@/i18n/navigation', () => ({
  Link: ({ href, children }: any) => (
    <a href={href}>{children}</a>
  ),
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
it('passes user to HeaderClient', async () => {
  getUser.mockResolvedValue({
    data: {
      user: {
        email: 'test@test.com',
      },
    },
  });

render(<HeaderClient user={null} />);

expect(screen.getByText('Home')).toBeInTheDocument();
expect(screen.getByText('About')).toBeInTheDocument();

expect(screen.getByText('Sign In')).toBeInTheDocument();
expect(screen.getByText('Sign Up')).toBeInTheDocument();

expect(screen.queryByText('History')).not.toBeInTheDocument();
})
*/
