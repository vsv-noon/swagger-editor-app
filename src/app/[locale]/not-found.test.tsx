import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import NotFound from './not-found';
import styles from './not-found.module.scss';

const mockTranslate = vi.fn((key: string) => {
  const translations: Record<string, string> = {
    '404': '404 - Page Not Found',
    home: 'Go Back Home',
  };
  return translations[key] || key;
});

vi.mock('next-intl', () => ({
  useTranslations: () => mockTranslate,
}));

vi.mock('@/i18n/navigation', () => ({
  Link: ({ href, children, className }: never) => (
    <a href={href} className={className}>
      {children}
    </a>
  ),
}));

describe('NotFound Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render the error title with correct translation', () => {
    render(<NotFound />);

    expect(mockTranslate).toHaveBeenCalledWith('404');

    const title = screen.getByRole('heading', { level: 1 });
    expect(title).toHaveTextContent('404 - Page Not Found 😕');
  });

  it('should render the navigation link pointing to the homepage', () => {
    render(<NotFound />);

    expect(mockTranslate).toHaveBeenCalledWith('home');

    const homeLink = screen.getByRole('link', { name: /Go Back Home/i });

    expect(homeLink).toBeInTheDocument();

    expect(homeLink).toHaveAttribute('href', '/');
  });

  it('should apply styles correctly from the scss module', () => {
    const { container } = render(<NotFound />);

    const rootDiv = container.firstChild;
    expect(rootDiv).toBeInTheDocument();

    const linkElement = screen.getByRole('link');
    expect(linkElement).toHaveClass(styles.notFoundBtn);
  });
});
