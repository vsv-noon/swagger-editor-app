import { AnchorHTMLAttributes, PropsWithChildren } from 'react';

import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import Footer from './Footer';

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => {
    const translations: Record<string, string> = {
      about: 'About',
    };

    return translations[key] ?? key;
  },
}));

vi.mock('@/i18n/navigation', () => ({
  Link: ({
    href,
    children,
    ...props
  }: PropsWithChildren<
    AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }
  >) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

describe('Footer', () => {
  it('renders footer content', () => {
    render(<Footer />);

    expect(screen.getByRole('link', { name: 'About' })).toHaveAttribute(
      'href',
      '/about'
    );

    expect(screen.getByText('2026')).toBeInTheDocument();

    expect(screen.getByRole('link', { name: 'RS School' })).toHaveAttribute(
      'href',
      'https://rs.school/'
    );
  });
});
