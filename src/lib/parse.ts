import { parse } from 'yaml';

export function detectFormat(code: string): 'json' | 'yaml' {
  const trimmed = code.trim();

  if (!trimmed) return 'yaml';

  if (
    (trimmed.startsWith('{') && trimmed.endsWith('}')) ||
    (trimmed.startsWith('[') && trimmed.endsWith(']'))
  ) {
    try {
      JSON.parse(code);
      return 'json';
    } catch {
      return 'yaml';
    }
  }

  return 'yaml';
}

export function parseCode(code: string) {
  try {
    const data = parse(code);

    const format = detectFormat(code);

    return {
      format,
      data,
    };
  } catch {
    return null;
  }
}
