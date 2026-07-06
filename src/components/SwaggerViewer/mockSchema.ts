import { parseOpenApi } from './parseOpenApi';

import type { LoadMockSchemaResult, OpenApiDocument } from './types';

export async function loadMockSchema(
  parsedFromEditor: unknown
): Promise<LoadMockSchemaResult> {
  const parsed = parsedFromEditor as OpenApiDocument;

  return {
    servers: parsed.servers ?? [],
    endpoints: parseOpenApi(parsed),
  };
}
