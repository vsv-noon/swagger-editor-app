import { describe, expect, it } from 'vitest';

import {
  generateExample,
  isObject,
  parseOpenApi,
  parseRequestBody,
  parseResponses,
  resolveSchema,
} from './parseOpenApi';

it('isObject', () => {
  expect(isObject({})).toBe(true);
  expect(isObject(null)).toBe(false);
  expect(isObject(5)).toBe(false);
});

describe('test parseOpenApi function', () => {
  it('returns empty array for invalid document', () => {
    expect(parseOpenApi(null)).toEqual([]);
    expect(parseOpenApi({})).toEqual([]);
  });
  it('parses endpoint', () => {
    const doc = {
      paths: {
        '/users': {
          get: {
            responses: {},
          },
        },
      },
    };

    expect(parseOpenApi(doc)).toEqual([
      {
        path: '/users',
        method: 'get',
        parameters: [],
        requestBody: undefined,
        responses: [],
      },
    ]);
  });
  it('ignores unknown methods', () => {
    const doc = {
      paths: {
        '/users': {
          trace: {},
        },
      },
    };

    expect(parseOpenApi(doc)).toEqual([]);
  });
  it('parses parameters', () => {
    const doc = {
      paths: {
        '/users/{id}': {
          get: {
            parameters: [
              {
                name: 'id',
                in: 'path',
                required: true,
              },
              {
                name: 'page',
                in: 'query',
              },
            ],
            responses: {},
          },
        },
      },
    };

    const result = parseOpenApi(doc);

    expect(result[0].parameters).toEqual([
      {
        name: 'id',
        in: 'path',
        required: true,
      },
      {
        name: 'page',
        in: 'query',
        required: false,
      },
    ]);
  });
  it('parses wrong parameters', () => {
    const doc = {
      paths: {
        '/users/{id}': {
          get: {
            parameters: [
              { name: 5, in: 'path' },
              { name: 'id', in: 'wrong' },
            ],
            responses: {},
          },
        },
      },
    };

    const result = parseOpenApi(doc);

    expect(result[0].parameters).toEqual([]);
  });
  it('ignores invalid parameters', () => {
    const doc = {
      paths: {
        '/users/{id}': {
          get: {
            parameters: [
              { name: 5, in: 'path' },
              { name: 'id', in: 'wrong' },
            ],
            responses: {},
          },
        },
      },
    };

    const result = parseOpenApi(doc);

    expect(result[0].parameters).toEqual([]);
  });
});

it('parses request body', () => {
  const requestBody = {
    content: {
      'application/json': {
        schema: {
          type: 'string',
        },
      },
    },
  };

  const result = parseRequestBody(requestBody, {});

  expect(result).toBeDefined();
  expect(result?.contentType).toBe('application/json');
  expect(result?.schema?.type).toBe('string');
  expect(result?.example).toBe('string');
});
it('parses responses body', () => {
  const responsesBody = {
    '200': {
      description: 'OK',
      content: {
        'application/json': {
          schema: {
            type: 'integer',
          },
        },
      },
    },
  };

  const result = parseResponses(responsesBody, {});

  expect(result).toBeDefined();
  expect(result[0].contentType).toBe('application/json');
  expect(result[0].statusCode).toBe('200');
  expect(result[0].description).toBe('OK');
});

describe('test resolveSchema function', () => {
  it('resolves $ref schema', () => {
    const schemas = {
      User: {
        type: 'object',
        properties: {
          id: {
            type: 'integer',
          },
        },
      },
    };

    const result = resolveSchema(
      {
        $ref: '#/components/schemas/User',
      },
      schemas
    );

    expect(result).toEqual({
      type: 'object',
      properties: {
        id: {
          type: 'integer',
        },
      },
    });
  });
  it('returns undefined for unknown ref', () => {
    const result = resolveSchema(
      {
        $ref: '#/components/schemas/Unknown',
      },
      {}
    );

    expect(result).toBeUndefined();
  });
  it('parses simple schema', () => {
    const result = resolveSchema(
      {
        type: 'string',
        format: 'email',
        example: 'test@test.com',
      },
      {}
    );

    expect(result).toEqual({
      type: 'string',
      format: 'email',
      example: 'test@test.com',
    });
  });
  it('returns undefined for invalid $ref', () => {
    const result = resolveSchema(
      {
        $ref: '',
      },
      {}
    );

    expect(result).toBeUndefined();
  });
  it('parses description', () => {
    const result = resolveSchema(
      {
        type: 'string',
        description: 'User name',
      },
      {}
    );

    expect(result?.description).toBe('User name');
  });
  it('parses enum', () => {
    const result = resolveSchema(
      {
        type: 'string',
        enum: ['red', 'green', 'blue'],
      },
      {}
    );

    expect(result?.enum).toEqual(['red', 'green', 'blue']);
  });
  it('parses array items', () => {
    const result = resolveSchema(
      {
        type: 'array',
        items: {
          type: 'integer',
        },
      },
      {}
    );

    expect(result?.type).toBe('array');
    expect(result?.items).toEqual({
      type: 'integer',
    });
  });
});

describe('test generateExample function', () => {
  it('returns null for undefined schema', () => {
    expect(generateExample()).toBeNull();
  });
  it('returns explicit example', () => {
    expect(
      generateExample({
        example: 'Kate',
      })
    ).toBe('Kate');
  });
  it('returns first enum value', () => {
    expect(
      generateExample({
        enum: ['red', 'green'],
      })
    ).toBe('red');
  });
  it('generates string example', () => {
    expect(
      generateExample({
        type: 'string',
      })
    ).toBe('string');
  });
  it('generates boolean example', () => {
    expect(
      generateExample({
        type: 'boolean',
      })
    ).toBe(true);
  });
  it('generates array example', () => {
    expect(
      generateExample({
        type: 'array',
        items: {
          type: 'integer',
        },
      })
    ).toEqual([0]);
  });
  it('generates object example', () => {
    expect(
      generateExample({
        type: 'object',
        properties: {
          id: {
            type: 'integer',
          },
          name: {
            type: 'string',
          },
        },
      })
    ).toEqual({
      id: 0,
      name: 'string',
    });
  });
  it('returns null for unknown type', () => {
    expect(
      generateExample({
        type: 'unknown' as never,
      })
    ).toBeNull();
  });
});
