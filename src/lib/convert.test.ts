import { describe, it, expect } from 'vitest';

import { convertFormat } from './convert';

describe('convertFormat Utility', () => {
  it('should successfully convert YAML to JSON string with indentations', () => {
    const yamlInput = `
      openapi: 3.0.0
      info:
        title: Test API
    `;

    const result = convertFormat(yamlInput, 'json');

    expect(result).toBe(
      `{
  "openapi": "3.0.0",
  "info": {
    "title": "Test API"
  }
}`
    );
  });

  it('should successfully convert JSON to YAML string', () => {
    const jsonInput = '{"openapi": "3.0.0", "info": {"title": "Test API"}}';

    const result = convertFormat(jsonInput, 'yaml');

    expect(result).toContain('openapi: 3.0.0');
    expect(result).toContain('title: Test API');
  });

  it('should return null if input code has syntax errors and cannot be parsed', () => {
    const brokenInput = '::: this is definitely not a valid yaml or json :::';

    const result = convertFormat(brokenInput, 'json');

    expect(result).toBeNull();
  });

  it('should return null if target format is handled but input is partially broken object', () => {
    const brokenJson = '{"name": "test"';

    const result = convertFormat(brokenJson, 'yaml');

    expect(result).toBeNull();
  });
});
