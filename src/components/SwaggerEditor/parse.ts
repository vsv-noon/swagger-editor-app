import * as yamlParser from 'js-yaml';

export function parseCode(code: string) {
  try {
    return {
      format: 'json',
      data: JSON.parse(code),
    };
  } catch {
    try {
      return {
        format: 'yaml',
        data: yamlParser.load(code),
      };
    } catch {
      return null;
    }
  }
}
