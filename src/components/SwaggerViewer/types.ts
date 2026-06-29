export type HttpMethod = 'get' | 'post' | 'put' | 'delete' | 'patch';

export type ParamLocation = 'path' | 'query' | 'header' | 'cookie';

export interface EndpointParam {
  name: string;
  in: ParamLocation;
  required: boolean;
}

export interface Endpoint {
  path: string;
  method: HttpMethod;
  parameters: EndpointParam[];
}
