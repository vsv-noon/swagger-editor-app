import { render, screen } from '@testing-library/react';
import { notFound } from 'next/navigation';
import { hasLocale } from 'next-intl';
import { setRequestLocale, getMessages } from 'next-intl/server';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import LocaleLayout, { generateStaticParams } from './layout';

const { mockLocales } = vi.hoisted(() => ({
  mockLocales: ['en', 'ru'],
}));

vi.mock('next/font/google', () => ({
  Geist: () => ({ variable: 'mock-geist-sans' }),
  Geist_Mono: () => ({ variable: 'mock-geist-mono' }),
}));

vi.mock('next-intl/server', () => ({
  setRequestLocale: vi.fn(),
  getMessages: vi.fn(),
}));

vi.mock('next-intl', () => ({
  hasLocale: vi.fn(),
  NextIntlClientProvider: ({ children, messages }: never) => (
    <div data-testid="intl-provider" data-messages={JSON.stringify(messages)}>
      {children}
    </div>
  ),
}));

vi.mock('next/navigation', () => ({
  notFound: vi.fn(() => {
    throw new Error('notFound called');
  }),
}));

vi.mock('@/i18n/routing', () => ({
  routing: {
    locales: mockLocales,
  },
}));

describe('LocaleLayout Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(hasLocale).mockReturnValue(true);
    vi.mocked(getMessages).mockResolvedValue({ welcome: 'Hello' });
  });

  describe('generateStaticParams', () => {
    it('should return an array of locale objects based on routing configuration', () => {
      const params = generateStaticParams();
      expect(params).toEqual([{ locale: 'en' }, { locale: 'ru' }]);
    });
  });

  describe('Layout Rendering', () => {
    it('should trigger notFound() if the locale is not supported', async () => {
      vi.mocked(hasLocale).mockReturnValue(false);

      const mockParams = Promise.resolve({ locale: 'fr' });

      await expect(
        LocaleLayout({ children: <div />, params: mockParams })
      ).rejects.toThrow('notFound called');

      expect(hasLocale).toHaveBeenCalledWith(mockLocales, 'fr');
      expect(notFound).toHaveBeenCalledTimes(1);
    });

    it('should successfully initialize request locale and render children inside providers', async () => {
      const mockParams = Promise.resolve({ locale: 'ru' });
      const childrenText = 'Main Application Content';

      const jsx = await LocaleLayout({
        children: <div data-testid="child">{childrenText}</div>,
        params: mockParams,
      });

      render(jsx);

      expect(setRequestLocale).toHaveBeenCalledWith('ru');
      expect(document.documentElement.getAttribute('lang')).toBe('ru');
      expect(screen.getByTestId('child')).toHaveTextContent(childrenText);
    });
  });
});
