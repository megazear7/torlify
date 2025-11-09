import { Request, Response, NextFunction, Router } from "express";
import { HttpMethod } from "../shared/type.http.js";

export interface Controller {
  readonly method: HttpMethod;
  readonly path: string;
  handler(req: Request, res: Response): Promise<void>;
  wrapper(
    controller: Function, // eslint-disable-line @typescript-eslint/no-unsafe-function-type
  ): (req: Request, res: Response, next: NextFunction) => void;
  register(router: Router): void;
}

export abstract class AbstractController implements Controller {
  abstract readonly method: HttpMethod;
  abstract readonly path: string;
  abstract handler(req: Request, res: Response): Promise<void>;

  wrapper(
    controller: Function, // eslint-disable-line @typescript-eslint/no-unsafe-function-type
  ): (req: Request, res: Response, next: NextFunction) => void {
    return (req: Request, res: Response, next: NextFunction) => {
      try {
        return controller(req, res, next).catch((error: unknown) =>
          next(error),
        );
      } catch (error) {
        next(error);
      }
    };
  }

  async register(router: Router): Promise<void> {
    router[this.method](this.path, this.wrapper(this.handler.bind(this)));
  }
}
