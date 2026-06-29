import type {
  Endpoint,
  EndpointParam,
  HttpMethod,
  ParamLocation,
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

      const params: EndpointParam[] = [];

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
      });
    }
  }

  return result;
}
