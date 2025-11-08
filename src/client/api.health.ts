import { Health } from "../shared/type.health";

export async function healthApi(): Promise<Health> {
  return Health.parse(await (await fetch("/health")).json());
}
