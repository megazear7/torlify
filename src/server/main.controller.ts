import { Request, Response, NextFunction, Router } from "express";

export interface Controller {
  readonly path: string;
  handler(req: Request, res: Response): Promise<void>;
  wrapper(
    controller: Function, // eslint-disable-line @typescript-eslint/no-unsafe-function-type
  ): (req: Request, res: Response, next: NextFunction) => void;
  register(router: Router): void;
}

export abstract class AbstractController implements Controller {
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
    router.get(this.path, this.wrapper(this.handler.bind(this)));
  }
}
