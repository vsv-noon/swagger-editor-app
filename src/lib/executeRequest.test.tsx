import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import { executeRequest } from './executeRequest';

describe('executeRequest', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('calls fetch with correct payload', async () => {
    const response = {} as Response;

    vi.mocked(fetch).mockResolvedValue(response);

    const payload = {
      server: 'http://localhost:8080',
      path: '/users',
      method: 'GET',
      isBinary: false,
    };

    const result = await executeRequest(payload);

    expect(fetch).toHaveBeenCalledWith('/api/execute', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    expect(result).toBe(response);
  });

  it('merges custom headers', async () => {
    vi.mocked(fetch).mockResolvedValue({} as Response);

    await executeRequest({
      server: '',
      path: '/users',
      method: 'POST',
      isBinary: false,
      headers: {
        Authorization: 'Bearer token',
      },
    });

    expect(fetch).toHaveBeenCalledWith(
      '/api/execute',
      expect.objectContaining({
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer token',
        },
      })
    );
  });
});
