import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import ErrorComponent from './error';

const mockTranslate = vi.fn((key: string) => {
  const translations: Record<string, string> = {
    title: 'Something went wrong!',
    button: 'Try again',
  };
  return translations[key] || key;
});

vi.mock('next-intl', () => ({
  useTranslations: () => mockTranslate,
}));

vi.mock('next/image', () => ({
  default: ({
    src,
    alt,
    width,
    height,
    priority,
  }: {
    src: string | { src: string };
    alt?: string;
    width?: number;
    height?: number;
    priority?: boolean;
  }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={typeof src === 'object' ? src.src : src}
      alt={alt}
      width={width}
      height={height}
      data-priority={priority ? 'true' : undefined}
    />
  ),
}));

vi.mock('@/assets/error.png', () => ({
  default: { src: '/mock-error-image.png' },
}));

describe('Error Boundary Component', () => {
  const mockError = new Error('Test application crash');
  const mockReset = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should log the error to console when mounted', () => {
    render(<ErrorComponent error={mockError} reset={mockReset} />);

    expect(console.error).toHaveBeenCalledWith(mockError);
    expect(console.error).toHaveBeenCalledTimes(1);
  });

  it('should render titles and buttons from translation hook', () => {
    render(<ErrorComponent error={mockError} reset={mockReset} />);

    expect(mockTranslate).toHaveBeenCalledWith('title');
    expect(mockTranslate).toHaveBeenCalledWith('button');

    expect(
      screen.getByRole('heading', { level: 1, name: 'Something went wrong!' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Try again' })
    ).toBeInTheDocument();
  });

  it('should render the error image with correct properties', () => {
    render(<ErrorComponent error={mockError} reset={mockReset} />);

    const image = screen.getByRole('img', { name: 'error' });

    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('width', '300');
    expect(image).toHaveAttribute('height', '300');
    expect(image).toHaveAttribute('data-priority', 'true');
  });

  it('should call reset function when the button is clicked', () => {
    render(<ErrorComponent error={mockError} reset={mockReset} />);

    const button = screen.getByRole('button', { name: 'Try again' });
    fireEvent.click(button);

    expect(mockReset).toHaveBeenCalledTimes(1);
  });
});
