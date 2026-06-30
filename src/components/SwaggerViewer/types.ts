export type HttpMethod = 'get' | 'post' | 'put' | 'delete' | 'patch';

export type ParamLocation = 'path' | 'query' | 'header' | 'cookie';
type JsonValue =
  | string
  | number
  | boolean
  | null
  | { [k: string]: JsonValue }
  | JsonValue[];

export interface EndpointParam {
  name: string;
  in: ParamLocation;
  required: boolean;
}
export interface RequestBody {
  contentType: string;
  schema?: unknown;
  example?: unknown;
}

export interface ResponseInfo {
  statusCode: string;
  description: string;
  contentType?: string;
  schema?: unknown;
  example?: unknown;
}

export interface Endpoint {
  path: string;
  method: HttpMethod;
  parameters: EndpointParam[];
  requestBody?: RequestBody;
  responses: ResponseInfo[];
}
