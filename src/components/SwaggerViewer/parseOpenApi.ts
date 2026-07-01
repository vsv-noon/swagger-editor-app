import type {
  Endpoint,
  EndpointParam,
  HttpMethod,
  JsonValue,
  OpenApiSchema,
  ParamLocation,
  RequestBody,
  ResponseInfo,
} from './types';

export function isObject(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null;
}

function isParamLocation(v: unknown): v is ParamLocation {
  return v === 'path' || v === 'query' || v === 'header' || v === 'cookie';
}

function isHttpMethod(v: string): v is HttpMethod {
  return (
    v === 'get' ||
    v === 'post' ||
    v === 'put' ||
    v === 'delete' ||
    v === 'patch'
  );
}

function parseParam(p: unknown): EndpointParam | null {
  if (!isObject(p)) return null;

  const name = p.name;
  const inLoc = p.in;
  const required = p.required;

  if (typeof name !== 'string') return null;
  if (!isParamLocation(inLoc)) return null;

  return {
    name,
    in: inLoc,
    required: required === true,
  };
}

export function parseOpenApi(raw: unknown): Endpoint[] {
  if (!isObject(raw)) return [];

  const paths = raw.paths;
  if (!isObject(paths)) return [];

  const components = isObject(raw.components) ? raw.components : undefined;

  const schemas = isObject(components?.schemas) ? components.schemas : {};

  const result: Endpoint[] = [];

  for (const path of Object.keys(paths)) {
    const pathItem = paths[path];

    if (!isObject(pathItem)) continue;

    for (const method of Object.keys(pathItem)) {
      const methodLower = method.toLowerCase();

      if (!isHttpMethod(methodLower)) continue;

      const operation = pathItem[method];
      if (!isObject(operation)) continue;

      const paramsRaw = operation.parameters;
      const request = parseRequestBody(operation.requestBody, schemas);

      const params: EndpointParam[] = [];
      const responses = parseResponses(operation.responses, schemas);
      if (Array.isArray(paramsRaw)) {
        for (const p of paramsRaw) {
          const parsed = parseParam(p);
          if (parsed) params.push(parsed);
        }
      }

      result.push({
        path,
        method: methodLower,
        parameters: params,
        requestBody: request,
        responses,
      });
    }
  }

  return result;
}
function parseRequestBody(
  body: unknown,
  schemas: Record<string, unknown>
): RequestBody | undefined {
  if (!isObject(body)) return undefined;

  const content = body.content;

  if (!isObject(content)) return undefined;

  const contentTypes = Object.keys(content);

  if (contentTypes.length === 0) return undefined;

  const contentType = contentTypes[0];

  const mediaType = content[contentType];

  if (!isObject(mediaType)) return undefined;
  const schema = resolveSchema(mediaType.schema, schemas);

  return {
    contentType,
    schema,
    example: generateExample(schema),
  };
}

function parseResponses(
  raw: unknown,
  schemas: Record<string, unknown>
): ResponseInfo[] {
  if (!isObject(raw)) return [];

  const result: ResponseInfo[] = [];

  for (const statusCode of Object.keys(raw)) {
    const responseRaw = raw[statusCode];

    if (!isResponseObject(responseRaw)) continue;

    const description =
      typeof responseRaw.description === 'string'
        ? responseRaw.description
        : '';

    let contentType: string | undefined;
    let schema: OpenApiSchema | undefined;
    let example: JsonValue | undefined;

    const content = responseRaw.content;

    if (isObject(content)) {
      const types = Object.keys(content);

      if (types.length > 0) {
        const firstType = types[0];
        contentType = firstType;

        const media = content[firstType];

        if (isObject(media)) {
          schema = resolveSchema(media.schema, schemas);
          example = generateExample(schema);
        }
      }
    }

    result.push({
      statusCode,
      description,
      contentType,
      schema,
      example,
    });
  }

  return result;
}
function isResponseObject(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null;
}
function resolveSchema(
  schema: unknown,
  schemas: Record<string, unknown>
): OpenApiSchema | undefined {
  if (!isObject(schema)) {
    return undefined;
  }

  if (typeof schema.$ref === 'string') {
    const name = schema.$ref.split('/').pop();

    if (!name) {
      return undefined;
    }

    return resolveSchema(schemas[name], schemas);
  }

  const result: OpenApiSchema = {};

  if (typeof schema.type === 'string') {
    result.type = schema.type;
  }

  if (typeof schema.format === 'string') {
    result.format = schema.format;
  }

  if (typeof schema.description === 'string') {
    result.description = schema.description;
  }

  if ('example' in schema) {
    const example = schema.example;

    if (
      typeof example === 'string' ||
      typeof example === 'number' ||
      typeof example === 'boolean' ||
      example === null ||
      Array.isArray(example) ||
      isObject(example)
    ) {
      result.example = example as JsonValue;
    }
  }

  if (Array.isArray(schema.enum)) {
    result.enum = schema.enum as JsonValue[];
  }

  if (isObject(schema.properties)) {
    result.properties = {};

    for (const key of Object.keys(schema.properties)) {
      const property = resolveSchema(schema.properties[key], schemas);

      if (property) {
        result.properties[key] = property;
      }
    }
  }

  if (schema.items !== undefined) {
    const items = resolveSchema(schema.items, schemas);

    if (items) {
      result.items = items;
    }
  }

  return result;
}
function generateExample(schema?: OpenApiSchema): JsonValue {
  if (!schema) return null;

  if (schema.example !== undefined) {
    return schema.example;
  }

  if (schema.enum?.length) {
    return schema.enum[0];
  }

  switch (schema.type) {
    case 'string':
      return 'string';

    case 'integer':
    case 'number':
      return 0;

    case 'boolean':
      return true;

    case 'array':
      return [generateExample(schema.items) ?? 'string'];

    case 'object': {
      const obj: Record<string, JsonValue> = {};

      const props = schema.properties ?? {};

      for (const key of Object.keys(props)) {
        obj[key] = generateExample(props[key]) ?? null;
      }

      return obj;
    }

    default:
      return null;
  }
}
