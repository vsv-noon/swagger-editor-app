import * as YAML from 'js-yaml';

import { parseOpenApi } from './parseOpenApi';

import type { Endpoint } from './types';

export async function loadMockSchema(
  parsedFromEdite: unknown
): Promise<Endpoint[]> {
  const parsed: unknown = parsedFromEdite;
  return parseOpenApi(parsed);
}
