import { Request, Response, NextFunction, Router } from "express";
import { HttpMethod } from "../shared/type.http.js";
import { parseRouteParams } from "../shared/util.route-params.js";

export interface RequestOptions<RequestBodyType, PathParams> {
  request: Request;
  response: Response;
  bodyParams: RequestBodyType;
  pathParams: PathParams;
}

export interface Controller<RequestBodyType, PathParams, ResponseContent> {
  readonly method: HttpMethod;
  readonly path: string;
  handler(
    options: RequestOptions<RequestBodyType, PathParams>,
  ): Promise<ResponseContent>;
  wrapper(
    controller: Function, // eslint-disable-line @typescript-eslint/no-unsafe-function-type
  ): (req: Request, res: Response, next: NextFunction) => Promise<void>;
  register(router: Router): void;
}

export abstract class AbstractController<
  RequestBodyType,
  PathParams,
  ResponseContent,
> implements Controller<RequestBodyType, PathParams, ResponseContent>
{
  abstract readonly method: HttpMethod;
  abstract readonly path: string;
  abstract handler(
    options: RequestOptions<RequestBodyType, PathParams>,
  ): Promise<ResponseContent>;

  wrapper(): (req: Request, res: Response, next: NextFunction) => Promise<void> {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        const pathParams = parseRouteParams(this.path, req.path);
        const body = req.body as RequestBodyType;
        const options: RequestOptions<RequestBodyType, PathParams> = {
          request: req,
          response: res,
          bodyParams: body,
          pathParams: pathParams as PathParams,
        };
        if (req.path.startsWith("/api/")) {
          console.log(`API Request: ${req.method} ${req.path}`);
          res.json(await this.handler(options));
        } else {
          console.log(`Page Request: ${req.method} ${req.path}`);
          res.send(await this.handler(options));
        }
      } catch (error) {
        next(error);
      }
    };
  }

  async register(router: Router): Promise<void> {
    router[this.method](this.path, this.wrapper());
  }
}
