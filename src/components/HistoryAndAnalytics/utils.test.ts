import { describe, it, expect } from 'vitest';

import { parseObjectKeys, trimUrl } from './utils';

describe('parseObjectKeys', () => {
  it('must return key URL without changes', () => {
    const input: [string, string] = ['URL', 'https://example.com'];
    const result = parseObjectKeys(input);

    expect(result).toEqual(['URL', 'https://example.com']);
  });

  it('must split camelCase by upper letter and return it lowerCase', () => {
    expect(parseObjectKeys(['requestDuration', '33ms'])).toEqual([
      'request duration',
      '33ms',
    ]);

    expect(parseObjectKeys(['responseStatusCode', '200'])).toEqual([
      'response status code',
      '200',
    ]);
  });

  it('must return lowercase keys without changes', () => {
    const input: [string, string] = ['endpoint', '/api/data'];
    const result = parseObjectKeys(input);

    expect(result).toEqual(['endpoint', '/api/data']);
  });
});

describe('trimUrl', () => {
  it('must return domain name after slash', () => {
    const URL = 'https://example.com';
    const result = trimUrl(URL);

    expect(result).toEqual('example.com');
  });
});
