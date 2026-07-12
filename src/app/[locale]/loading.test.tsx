import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import Loading from './loading';

vi.mock('@/components/Loader', () => ({
  default: ({ variant }: { variant: string }) => (
    <div data-testid="mock-loader">Loader variant: {variant}</div>
  ),
}));

describe('Loading Component', () => {
  it('should render the Loader component with "fullscreen" variant', () => {
    render(<Loading />);

    const loaderElement = screen.getByTestId('mock-loader');

    expect(loaderElement).toBeInTheDocument();
  });
});
