export type HttpMethod = 'get' | 'post' | 'put' | 'delete' | 'patch';

export type ParamLocation = 'path' | 'query' | 'header' | 'cookie';
export type JsonValue =
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
export interface OpenApiSchema {
  type?: string;
  format?: string;
  example?: JsonValue;
  description?: string;
  enum?: JsonValue[];

  properties?: Record<string, OpenApiSchema>;

  items?: OpenApiSchema;

  $ref?: string;
}
export interface RequestBody {
  contentType: string;
  schema?: OpenApiSchema;
  example?: JsonValue;
}

export interface ResponseInfo {
  statusCode: string;
  description: string;
  contentType?: string;
  schema?: OpenApiSchema;
  example?: JsonValue;
}

export interface Endpoint {
  path: string;
  method: HttpMethod;
  parameters: EndpointParam[];
  requestBody?: RequestBody;
  responses: ResponseInfo[];
}
