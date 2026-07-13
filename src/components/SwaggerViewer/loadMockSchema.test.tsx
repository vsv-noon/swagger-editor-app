import { describe, expect, it, vi } from 'vitest';

import { loadMockSchema } from './mockSchema';
import { parseOpenApi } from './parseOpenApi';

vi.mock('./parseOpenApi', () => ({
  parseOpenApi: vi.fn(),
}));
it('returns servers and parsed endpoints', async () => {
  vi.mocked(parseOpenApi).mockReturnValue([
    {
      path: '/users',
      method: 'get',
      parameters: [],
      responses: [],
    },
  ]);

  const result = await loadMockSchema({
    servers: [{ url: 'http://localhost' }],
  });

  expect(parseOpenApi).toHaveBeenCalled();

  expect(result).toEqual({
    servers: [{ url: 'http://localhost' }],
    endpoints: [
      {
        path: '/users',
        method: 'get',
        parameters: [],
        responses: [],
      },
    ],
  });
});
it('returns empty servers array when servers are missing', async () => {
  vi.mocked(parseOpenApi).mockReturnValue([]);

  const result = await loadMockSchema({});

  expect(result.servers).toEqual([]);
  expect(result.endpoints).toEqual([]);
});
