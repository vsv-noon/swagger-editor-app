import SwaggerParser from '@apidevtools/swagger-parser';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { parse } from 'yaml';

import { detectFormat } from './parse';
import { saveSchema } from './saveSchema';

vi.mock('@apidevtools/swagger-parser', () => ({
  default: {
    validate: vi.fn(),
  },
}));

vi.mock('yaml', () => ({
  parse: vi.fn(),
}));

vi.mock('./parse', () => ({
  detectFormat: vi.fn(() => 'yaml'),
}));

const mockInsert = vi.fn();
const mockFrom = vi.fn(() => ({
  insert: mockInsert,
}));
const mockGetUser = vi.fn();

const mockSupabaseClient = {
  auth: {
    getUser: mockGetUser,
  },
  from: mockFrom,
};

vi.mock('./supabase/server', () => ({
  createClient: vi.fn(async () => mockSupabaseClient),
}));

describe('saveSchema Server Function', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockGetUser.mockResolvedValue({ data: { user: { id: 'user_999' } } });
    vi.mocked(parse).mockReturnValue({ openapi: '3.0.0' });
    vi.mocked(SwaggerParser.validate).mockResolvedValue({
      openapi: '3.0.0',
      info: {
        title: 'Test',
        version: '1.0.0',
      },
      paths: {},
    });
    mockInsert.mockResolvedValue({ data: [{ id: 1 }], error: null });
  });

  it('should throw "Not authenticated" if user is not logged in', async () => {
    mockGetUser.mockResolvedValue({ data: { user: null } });

    await expect(saveSchema('openapi: 3.0.0')).rejects.toThrow(
      'Not authenticated'
    );

    expect(mockFrom).not.toHaveBeenCalled();
  });

  it('should throw "Empty schema" if code is empty or just spaces', async () => {
    await expect(saveSchema('   ')).rejects.toThrow('Empty schema');
    await expect(saveSchema('')).rejects.toThrow('Empty schema');
  });

  it('should throw "Invalid YAML/JSON" if parsing fails', async () => {
    vi.mocked(parse).mockImplementation(() => {
      throw new Error('YAMLException');
    });

    await expect(saveSchema('{ invalid json')).rejects.toThrow(
      'Invalid YAML/JSON'
    );
  });

  it('should throw validation error if SwaggerParser validation fails', async () => {
    vi.mocked(SwaggerParser.validate).mockRejectedValue(
      new Error('Missing title field')
    );

    await expect(saveSchema('openapi: 3.0.0')).rejects.toThrow(
      'Missing title field'
    );
  });

  it('should fallback to default error message if SwaggerParser error has no message', async () => {
    vi.mocked(SwaggerParser.validate).mockRejectedValue({});

    await expect(saveSchema('openapi: 3.0.0')).rejects.toThrow(
      'Invalid OpenAPI schema'
    );
  });

  it('should throw DB error message if Supabase insert fails', async () => {
    mockInsert.mockResolvedValue({
      data: null,
      error: { message: 'Database connection timeout' },
    });

    await expect(saveSchema('openapi: 3.0.0')).rejects.toThrow(
      'Database connection timeout'
    );
  });

  it('should successfully parse, validate, and save schema to database', async () => {
    const rawCode = 'openapi: 3.0.0\ninfo:\n  title: Test';
    const parsedObject = { openapi: '3.0.0', info: { title: 'Test' } };

    vi.mocked(parse).mockReturnValue(parsedObject);
    vi.mocked(detectFormat).mockReturnValue('yaml');
    mockInsert.mockResolvedValue({ data: { id: 42 }, error: null });

    const result = await saveSchema(rawCode);

    expect(parse).toHaveBeenCalledWith(rawCode);
    expect(SwaggerParser.validate).toHaveBeenCalledWith(parsedObject);
    expect(detectFormat).toHaveBeenCalledWith(rawCode);

    expect(mockFrom).toHaveBeenCalledWith('schemas');
    expect(mockInsert).toHaveBeenCalledWith([
      {
        content: rawCode,
        content_json: parsedObject,
        format: 'yaml',
        user_id: 'user_999',
      },
    ]);

    expect(result).toEqual({
      success: true,
      data: { id: 42 },
    });
  });
});
