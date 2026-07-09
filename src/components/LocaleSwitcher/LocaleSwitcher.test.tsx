import { render, screen, fireEvent } from '@testing-library/react';
import {
  ReadonlyURLSearchParams,
  usePathname,
  useSearchParams,
} from 'next/navigation';
import { vi, describe, it, expect, beforeEach } from 'vitest';

import LocaleSwitcher from './LocaleSwitcher';

const mockPush = vi.fn();
vi.mock('next/navigation', () => ({
  usePathname: vi.fn(),
  useRouter: () => ({ push: mockPush }),
  useSearchParams: vi.fn(),
}));

vi.mock('next-intl', () => ({
  useLocale: vi.fn(() => 'ru'),
  useTranslations: () => (key: string) => {
    const translations: Record<string, string> = {
      label: 'Выбор языка',
      en: 'Eng',
      ru: 'Рус',
    };
    return translations[key] || key;
  },
}));

describe('LocaleSwitcher component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders correctly with current locale and options', () => {
    vi.mocked(usePathname).mockReturnValue('/rus/about');
    vi.mocked(useSearchParams).mockReturnValue(
      new URLSearchParams('') as ReadonlyURLSearchParams
    );

    render(<LocaleSwitcher />);

    const select = screen.getByRole('combobox');
    expect(select).toBeInTheDocument();
    expect(select).toHaveValue('ru');
    expect(screen.getByRole('option', { name: 'Eng' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Рус' })).toBeInTheDocument();
  });

  it('changes locale correctly without search params', () => {
    vi.mocked(usePathname).mockReturnValue('/ru/history');
    vi.mocked(useSearchParams).mockReturnValue(
      new URLSearchParams('') as ReadonlyURLSearchParams
    );

    render(<LocaleSwitcher />);

    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: 'en' } });

    expect(mockPush).toHaveBeenCalledWith('/en/history');
  });

  it('retains search params when changing locale', () => {
    vi.mocked(usePathname).mockReturnValue('/ru/history');
    vi.mocked(useSearchParams).mockReturnValue(
      new URLSearchParams('item=book&sort=asc') as ReadonlyURLSearchParams
    );

    render(<LocaleSwitcher />);

    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: 'en' } });

    expect(mockPush).toHaveBeenCalledWith('/en/history?item=book&sort=asc');
  });

  it('does not route if pathname or searchParams are null', () => {
    vi.mocked(usePathname).mockReturnValue(null);
    vi.mocked(useSearchParams).mockReturnValue(null);

    render(<LocaleSwitcher />);

    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: 'en' } });

    expect(mockPush).not.toHaveBeenCalled();
  });
});
