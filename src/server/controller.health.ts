import { Request, Response } from "express";
import { healthService } from "./service.health.js";
import { AbstractController } from "./main.controller.js";
import { loadClientModels } from "./main.model.js";

export class HealthController extends AbstractController {
  readonly path = "/api/health";

  async handler(_req: Request, res: Response): Promise<void> {
    await loadClientModels();
    res.json(healthService());
  }
}
