import { Health } from "../shared/type.health.js";

export async function healthApi(): Promise<Health> {
  return Health.parse(await (await fetch("/api/health")).json());
}
