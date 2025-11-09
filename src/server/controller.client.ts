import { Request, Response } from "express";
import { page } from "./service.client.js";
import { AbstractController } from "./main.controller.js";
import { HttpMethod } from "../shared/type.http.js";

export class ClientController extends AbstractController {
  readonly method = HttpMethod.enum.get;
  readonly path = "/{*any}";

  async handler(_req: Request, res: Response): Promise<void> {
    res.send(page());
  }
}
