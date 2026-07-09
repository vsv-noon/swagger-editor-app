import { describe, it, expect, vi, beforeEach } from 'vitest';
import { parse } from 'yaml';

import { detectFormat, parseCode } from './parse';

vi.mock('yaml', () => ({
  parse: vi.fn(),
}));

describe('Parser Utilities', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('detectFormat', () => {
    it('should return "yaml" for empty string or whitespace', () => {
      expect(detectFormat('')).toBe('yaml');
      expect(detectFormat('   ')).toBe('yaml');
    });

    it('should return "json" for valid JSON objects and arrays', () => {
      expect(detectFormat('{"key": "value"}')).toBe('json');
      expect(detectFormat('[1, 2, 3]')).toBe('json');
    });

    it('should return "yaml" if text looks like JSON but has syntax errors', () => {
      expect(detectFormat('{"key": unquoted_value}')).toBe('yaml');
      expect(detectFormat('[1, 2, ]')).toBe('yaml');
    });

    it('should return "yaml" for standard YAML content', () => {
      expect(detectFormat('openapi: 3.0.0\ninfo:\n  title: Test')).toBe('yaml');
    });
  });

  describe('parseCode', () => {
    it('should successfully parse valid YAML and detect its format', () => {
      const yamlCode = 'version: 1';
      const expectedData = { version: 1 };

      vi.mocked(parse).mockReturnValue(expectedData);

      const result = parseCode(yamlCode);

      expect(parse).toHaveBeenCalledWith(yamlCode);
      expect(result).toEqual({
        format: 'yaml',
        data: expectedData,
      });
    });

    it('should successfully parse valid JSON and detect its format', () => {
      const jsonCode = '{"version": 1}';
      const expectedData = { version: 1 };

      vi.mocked(parse).mockReturnValue(expectedData);

      const result = parseCode(jsonCode);

      expect(parse).toHaveBeenCalledWith(jsonCode);
      expect(result).toEqual({
        format: 'json',
        data: expectedData,
      });
    });

    it('should return null if yaml.parse throws an error', () => {
      const brokenCode = '::: broken code :::';

      vi.mocked(parse).mockImplementation(() => {
        throw new Error('YAMLException');
      });

      const result = parseCode(brokenCode);

      expect(parse).toHaveBeenCalledWith(brokenCode);
      expect(result).toBeNull();
    });
  });
});
