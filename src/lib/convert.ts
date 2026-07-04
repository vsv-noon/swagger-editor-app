import { parse, stringify } from 'yaml';

export function convertFormat(code: string, to: 'yaml' | 'json') {
  try {
    const obj = parse(code);

    if (to === 'json') {
      return JSON.stringify(obj, null, 2);
    }

    if (to === 'yaml') {
      return stringify(obj);
    }
  } catch {
    return null;
  }
}
