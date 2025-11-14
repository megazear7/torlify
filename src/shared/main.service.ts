import { HttpMethod } from "./type.http.js";
import { renderPathname } from "./util.route-params.js";
import z, { ZodType } from "zod";

export const NoBodyParams = z.literal(undefined);
export type NoBodyParams = z.infer<typeof NoBodyParams>;

export const NoPathParams = z.record(z.string(), z.string());
export type NoPathParams = z.infer<typeof NoPathParams>;

export const ServiceType = z.enum(["json", "html"]);
export type ServiceType = z.infer<typeof ServiceType>;

export interface RequestOptions<RequestBodyType, PathParams extends Record<string, string>> {
  bodyParams: RequestBodyType;
  pathParams: PathParams;
}

export interface Service<RequestBodyType, PathParams extends Record<string, string>, ResponseContent> {
  readonly method: HttpMethod;
  readonly path: string;
  readonly RequestBodyType: ZodType<RequestBodyType>;
  readonly PathParams: ZodType<PathParams>;
  readonly ResponseContent: ZodType<ResponseContent>;
}

export abstract class AbstractService<
  RequestBodyType,
  PathParams extends Record<string, string>,
  ResponseContent,
> implements Service<RequestBodyType, PathParams, ResponseContent>
{
  abstract readonly method: HttpMethod;
  abstract readonly path: string;
  abstract readonly type: ServiceType;

  readonly RequestBodyType: ZodType<RequestBodyType>;
  readonly PathParams: ZodType<PathParams>;
  readonly ResponseContent: ZodType<ResponseContent>;

  constructor(
    RequestBodyType: ZodType<RequestBodyType>,
    PathParams: ZodType<PathParams>,
    ResponseContent: ZodType<ResponseContent>,
  ) {
    this.RequestBodyType = RequestBodyType;
    this.PathParams = PathParams;
    this.ResponseContent = ResponseContent;
  }

  async fetch({ bodyParams, pathParams }: RequestOptions<RequestBodyType, PathParams>): Promise<ResponseContent> {
    const requestConfig: RequestInit = {
      method: this.method.toUpperCase()
    };
    if (bodyParams) {
      requestConfig.body = JSON.stringify(bodyParams);
      requestConfig.headers = {
        "Content-Type": "application/json",
      };
    }
    const path = pathParams ? renderPathname(this.path, pathParams) : this.path;
    const res = await fetch(path, requestConfig);
    if (this.type === ServiceType.enum.html) {
      return res.text() as Promise<ResponseContent>;
    } else if (this.type === ServiceType.enum.json) {
      return this.ResponseContent.parse(await res.json());
    } else {
      throw new Error(`Unsupported service type: ${this.type}`);
    }
  }
}
