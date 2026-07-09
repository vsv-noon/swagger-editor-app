import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import { OPEN_API_EDITOR_INITIAL_VALUE } from '@/constants/defaultSchema';
import { parseCode } from '@/lib/parse';

import SwaggerPage from './SwaggerPage';

vi.mock('@/constants/defaultSchema', () => ({
  OPEN_API_EDITOR_INITIAL_VALUE: 'openapi: 3.0.0 (default)',
}));

vi.mock('@/lib/parse', () => ({
  parseCode: vi.fn(() => ({ format: 'yaml', data: {} })),
}));

vi.mock('@/components/SwaggerEditor', () => ({
  default: ({
    value,
    onChange,
  }: {
    value: string;
    onChange: (v: string) => void;
  }) => (
    <div data-testid="mock-swagger-editor">
      <span data-testid="editor-value">{value}</span>
      <button
        data-testid="trigger-change-btn"
        onClick={() => onChange('new updated code')}
      >
        Change Code
      </button>
    </div>
  ),
}));

vi.mock('@/components/Loader', () => ({
  default: ({ variant }: { variant: string }) => (
    <div data-testid="mock-loader">{variant}</div>
  ),
}));

describe('SwaggerPage Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should initialize state with provided initialCode and call parseCode', async () => {
    const customCode = 'openapi: 3.0.0 info: title: Custom API';

    render(<SwaggerPage initialCode={customCode} />);

    expect(parseCode).toHaveBeenCalledWith(customCode);

    const editorValue = await screen.findByTestId('editor-value');
    expect(editorValue).toHaveTextContent(customCode);
  });

  it('should fallback to OPEN_API_EDITOR_INITIAL_VALUE if initialCode is empty', async () => {
    render(<SwaggerPage initialCode="" />);

    expect(parseCode).toHaveBeenCalledWith(OPEN_API_EDITOR_INITIAL_VALUE);

    const editorValue = await screen.findByTestId('editor-value');
    expect(editorValue).toHaveTextContent(OPEN_API_EDITOR_INITIAL_VALUE);
  });

  it('should update code state and re-parse when SwaggerEditor triggers onChange', async () => {
    render(<SwaggerPage initialCode="initial code" />);

    vi.mocked(parseCode).mockClear();

    const changeButton = screen.getByTestId('trigger-change-btn');
    fireEvent.click(changeButton);

    const editorValue = await screen.findByTestId('editor-value');
    expect(editorValue).toHaveTextContent('new updated code');

    expect(parseCode).toHaveBeenCalledWith('new updated code');
  });
});
