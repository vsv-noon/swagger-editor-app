import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import { getLatestSchema } from '@/lib/getSchema';

import Home from './page';

vi.mock('@/lib/getSchema', () => ({
  getLatestSchema: vi.fn(),
}));

vi.mock('@/_pages/SwaggerPage/SwaggerPage', () => ({
  default: ({ initialCode }: { initialCode: string }) => (
    <div data-testid="mock-swagger-page">Code: {initialCode}</div>
  ),
}));

vi.mock('@/components/Loader', () => ({
  default: ({ variant }: { variant: string }) => (
    <div data-testid="mock-loader">Loader: {variant}</div>
  ),
}));

describe('Home Page (Server Component)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch data and render SwaggerPage with correct initial code', async () => {
    const mockSchemaCode = 'openapi: 3.0.0 info: title: My API';
    vi.mocked(getLatestSchema).mockResolvedValue(mockSchemaCode);

    const pageJsx = await Home();
    render(pageJsx);

    expect(getLatestSchema).toHaveBeenCalledTimes(1);

    expect(
      screen.getByRole('heading', { level: 1, name: 'Swagger/OpenAPI UI' })
    ).toBeInTheDocument();

    const swaggerPage = screen.getByTestId('mock-swagger-page');
    expect(swaggerPage).toBeInTheDocument();
    expect(swaggerPage).toHaveTextContent(`Code: ${mockSchemaCode}`);
  });

  it('should pass an empty string to SwaggerPage if getLatestSchema returns null', async () => {
    vi.mocked(getLatestSchema).mockResolvedValue(null);

    const pageJsx = await Home();
    render(pageJsx);

    expect(getLatestSchema).toHaveBeenCalledTimes(1);

    const swaggerPage = screen.getByTestId('mock-swagger-page');
    expect(swaggerPage).toBeInTheDocument();
    expect(swaggerPage).toHaveTextContent('Code:');
  });
});
