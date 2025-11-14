import { healthService } from "./service.health.js";
import { AbstractController } from "./main.controller.js";
import { HttpMethod } from "../shared/type.http.js";
import { Health } from "../shared/type.health.js";

export class HealthController extends AbstractController<
  undefined,
  undefined,
  Health
> {
  readonly method = HttpMethod.enum.get;
  readonly path = "/api/health";

  async handler(): Promise<Health> {
    return healthService();
  }
}
