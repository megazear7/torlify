import { Request, Response } from "express";
import { healthService } from "./service.health.js";
import { AbstractController } from "./main.controller.js";
import { HttpMethod } from "../shared/type.http.js";

export class HealthController extends AbstractController {
  readonly method = HttpMethod.enum.get;
  readonly path = "/api/health";

  async handler(_req: Request, res: Response): Promise<void> {
    res.json(healthService());
  }
}
