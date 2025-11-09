import { AppConfig } from "../shared/type.app.js";
import { fileExists } from "./util.fs.js";
import { RouteError } from "./util.route.js";
import { promises as fs } from "fs";

export const readAppConfig = async (): Promise<AppConfig> => {
  const path = `data/app/index.json`;
  const exists = await fileExists(path);
  if (!exists) throw new RouteError(404, `App config does not exist.`);
  const data = await fs.readFile(path, "utf-8");
  const json = JSON.parse(data);
  return AppConfig.parse(json);
};
