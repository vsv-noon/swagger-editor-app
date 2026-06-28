import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

import About from './page';

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}));

describe('About page', () => {
  it('renders without crashing', () => {
    render(<About />);
    expect(screen.getByText('name-k')).toBeInTheDocument();
  });
});
