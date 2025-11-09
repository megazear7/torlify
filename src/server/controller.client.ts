import { Request, Response } from "express";
import { page } from "./service.client.js";
import { AbstractController } from "./main.controller.js";

export class ClientController extends AbstractController {
  readonly path = "/{*any}";

  async handler(_req: Request, res: Response): Promise<void> {
    res.send(page());
  }
}
