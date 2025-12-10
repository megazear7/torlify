import { AbstractService, ServiceType } from "./main.service.js";
import { HttpMethod } from "./type.http.js";
import { AppConfig, AppConfigPartial } from "./type.app.js";
import z from "zod";

export const UpdateAppPathParameters = z.object({});
export type UpdateAppPathParameters = z.infer<typeof UpdateAppPathParameters>;

export const UpdateAppBodyParameters = z.object({
  app: AppConfigPartial,
});
export type UpdateAppBodyParameters = z.infer<typeof UpdateAppBodyParameters>;

export class UpdateAppService extends AbstractService<UpdateAppBodyParameters, UpdateAppPathParameters, AppConfig> {
  readonly type = ServiceType.enum.json;
  readonly method = HttpMethod.enum.put;
  readonly path = "/api/app";
}
export const updateAppService = new UpdateAppService(UpdateAppBodyParameters, UpdateAppPathParameters, AppConfig);
