import type {
  Endpoint,
  EndpointParam,
  HttpMethod,
  ParamLocation,
  RequestBody,
  ResponseInfo,
} from './types';

function isObject(v: unknown): v is Record<string, unknown> {
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
      const request = parseRequestBody(operation.requestBody);

      const params: EndpointParam[] = [];
      const responses = parseResponses(operation.responses);
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
function parseRequestBody(body: unknown): RequestBody | undefined {
  if (!isObject(body)) return undefined;

  const content = body.content;

  if (!isObject(content)) return undefined;

  const contentTypes = Object.keys(content);

  if (contentTypes.length === 0) return undefined;

  const contentType = contentTypes[0];

  const mediaType = content[contentType];

  if (!isObject(mediaType)) return undefined;

  return {
    contentType,
    schema: mediaType.schema,
    example: mediaType.example,
  };
}

function parseResponses(raw: unknown): ResponseInfo[] {
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
    let schema: unknown;
    let example: unknown;

    const content = responseRaw.content;

    if (isObject(content)) {
      const types = Object.keys(content);

      if (types.length > 0) {
        const firstType = types[0];
        contentType = firstType;

        const media = content[firstType];

        if (isObject(media)) {
          schema = media.schema;
          example = media.example;
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
