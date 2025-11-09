import z from "zod";
import { ModelConfigs } from "./type.model.js";

export const AppConfig = z.object({
  model: ModelConfigs,
});
export type AppConfig = z.infer<typeof AppConfig>;
