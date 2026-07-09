import { NextResponse } from 'next/server';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import { saveSchema } from '@/lib/saveSchema';

import { POST } from './route';

vi.mock('@/lib/saveSchema', () => ({
  saveSchema: vi.fn(),
}));

vi.mock('next/server', () => ({
  NextResponse: {
    json: vi.fn((body, init) => {
      return {
        status: init?.status || 200,
        json: async () => body,
      } as never;
    }),
  },
}));

describe('API Route Handler (POST)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return 200 and ok:true when schema is saved successfully', async () => {
    vi.mocked(saveSchema).mockResolvedValue({
      success: true,
      data: {} as never,
    });

    const mockRequestBody = { code: 'openapi: 3.0.0' };
    const mockRequest = new Request('http://localhost/api/save', {
      method: 'POST',
      body: JSON.stringify(mockRequestBody),
    });

    const response = await POST(mockRequest);
    const jsonResult = await response.json();

    expect(saveSchema).toHaveBeenCalledWith('openapi: 3.0.0');

    expect(NextResponse.json).toHaveBeenCalledWith({ ok: true });
    expect(response.status).toBe(200);
    expect(jsonResult).toEqual({ ok: true });
  });

  it('should return 400 and error message when saveSchema throws an error', async () => {
    vi.mocked(saveSchema).mockRejectedValue(
      new Error('Invalid OpenAPI schema')
    );

    const mockRequestBody = { code: 'broken code' };
    const mockRequest = new Request('http://localhost/api/save', {
      method: 'POST',
      body: JSON.stringify(mockRequestBody),
    });

    const response = await POST(mockRequest);
    const jsonResult = await response.json();

    expect(NextResponse.json).toHaveBeenCalledWith(
      { ok: false, error: 'Invalid OpenAPI schema' },
      { status: 400 }
    );
    expect(response.status).toBe(400);
    expect(jsonResult).toEqual({ ok: false, error: 'Invalid OpenAPI schema' });
  });
});
