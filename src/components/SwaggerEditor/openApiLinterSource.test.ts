import SwaggerParser from '@apidevtools/swagger-parser';
import { EditorView } from '@codemirror/view';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { parseCode } from '@/lib/parse';

import { openApiLinterSource } from './openApiLinterSource';

type MockEditorView = {
  state: {
    doc: {
      toString: () => string;
    };
  };
};

vi.mock('@/lib/parse', () => ({
  parseCode: vi.fn(),
}));

vi.mock('@apidevtools/swagger-parser', () => ({
  default: {
    validate: vi.fn(),
  },
}));

function createView(code: string): MockEditorView {
  return {
    state: {
      doc: {
        toString: () => code,
      },
    },
  };
}

describe('openApiLinterSource', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns empty diagnostics for empty document', async () => {
    const result = await openApiLinterSource(createView('') as EditorView);

    expect(result).toEqual([]);

    expect(parseCode).not.toHaveBeenCalled();
    expect(SwaggerParser.validate).not.toHaveBeenCalled();
  });

  it('returns empty diagnostics for whitespace document', async () => {
    const result = await openApiLinterSource(createView('   ') as EditorView);

    expect(result).toEqual([]);
  });

  it('returns error when code cannot be parsed', async () => {
    vi.mocked(parseCode).mockReturnValue(null);

    const result = await openApiLinterSource(
      createView('{ invalid }') as EditorView
    );

    expect(result).toEqual([
      {
        from: 0,
        to: 11,
        severity: 'error',
        message: 'Invalid JSON/YAML',
      },
    ]);

    expect(SwaggerParser.validate).not.toHaveBeenCalled();
  });

  it('returns empty diagnostics for valid OpenAPI schema', async () => {
    vi.mocked(parseCode).mockReturnValue({
      format: 'yaml',
      data: {
        openapi: '3.0.0',
        info: {
          title: 'Test',
          version: '1.0.0',
        },
        paths: {},
      },
    });

    vi.mocked(SwaggerParser.validate).mockResolvedValue(undefined as never);

    const result = await openApiLinterSource(
      createView('openapi: 3.0.0') as EditorView
    );

    expect(result).toEqual([]);

    expect(SwaggerParser.validate).toHaveBeenCalledWith({
      openapi: '3.0.0',
      info: {
        title: 'Test',
        version: '1.0.0',
      },
      paths: {},
    });
  });

  it('returns diagnostic when swagger validation fails', async () => {
    vi.mocked(parseCode).mockReturnValue({
      data: {
        openapi: '3.0.0',
      },
      format: 'yaml',
    });

    vi.mocked(SwaggerParser.validate).mockRejectedValue(
      new Error('Missing required field: info')
    );

    const result = await openApiLinterSource(
      createView('openapi: 3.0.0') as EditorView
    );

    expect(result).toEqual([
      {
        from: 0,
        to: 14,
        severity: 'error',
        message: 'Missing required field: info',
      },
    ]);
  });

  it('handles non Error thrown values', async () => {
    vi.mocked(parseCode).mockReturnValue({
      data: {},
      format: 'yaml',
    });

    vi.mocked(SwaggerParser.validate).mockRejectedValue('boom');

    const result = await openApiLinterSource(createView('{}') as EditorView);

    expect(result).toEqual([
      {
        from: 0,
        to: 2,
        severity: 'error',
        message: 'Unknown error',
      },
    ]);
  });
});
