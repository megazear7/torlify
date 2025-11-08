import { Health } from "../shared/type.health.js";
import { healthUtil } from "../shared/util.health.js";

export const healthService = (): Health => {
  return healthUtil();
};
