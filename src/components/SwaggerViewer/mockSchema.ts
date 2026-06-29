import YAML from 'js-yaml';

import { parseOpenApi } from './parseOpenApi';

import type { Endpoint } from './types';

export async function loadMockSchema(): Promise<Endpoint[]> {
  const res = await fetch('/mockSchema.yaml');
  const text = await res.text();

  const parsed: unknown = YAML.load(text);

  return parseOpenApi(parsed);
}
