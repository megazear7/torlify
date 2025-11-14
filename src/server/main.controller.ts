import { Request, Response, NextFunction, Router } from "express";
import { parseRouteParams } from "../shared/util.route-params.js";
import { RequestOptions, Service } from "../shared/main.service.js";

export interface Controller<RequestBodyType extends Record<string, any>, PathParams extends Record<string, string>, ResponseContent> {
  handler(
    options: RequestOptions<RequestBodyType, PathParams>,
  ): Promise<ResponseContent>;
  wrapper(
    Controller: Function, // eslint-disable-line @typescript-eslint/no-unsafe-function-type
  ): (req: Request, res: Response, next: NextFunction) => Promise<void>;
  register(router: Router): void;
}

export abstract class AbstractController<
  RequestBodyType extends Record<string, any>,
  PathParams extends Record<string, string>,
  ResponseContent,
> implements Controller<RequestBodyType, PathParams, ResponseContent>
{
  abstract handler(
    options: RequestOptions<RequestBodyType, PathParams>,
  ): Promise<ResponseContent>;

  private readonly service: Service<RequestBodyType, PathParams, ResponseContent>;

  constructor(
    service: Service<RequestBodyType, PathParams, ResponseContent>,
  ) {
    this.service = service;
  }

  wrapper(): (req: Request, res: Response, next: NextFunction) => Promise<void> {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        const pathParams = parseRouteParams(this.service.path, req.path);
        const body = this.service.RequestBodyType.parse(req.body ? req.body : {});
        const options: RequestOptions<RequestBodyType, PathParams> = {
          bodyParams: body,
          pathParams: this.service.PathParams.parse(pathParams),
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
    console.log(`Registering route: ${this.service.method} ${this.service.path}`);
    router[this.service.method](this.service.path, this.wrapper());
  }
}
