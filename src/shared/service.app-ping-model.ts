import { AbstractService, NoBodyParams, NoPathParams, ServiceType } from "./main.service.js";
import { HttpMethod } from "./type.http.js";
import z from "zod";

export const AppPingModelResponse = z.string();
export type AppPingModelResponse = z.infer<typeof AppPingModelResponse>;

export class AppPingModelService extends AbstractService<NoBodyParams, NoPathParams, AppPingModelResponse> {
  readonly type = ServiceType.enum.json;
  readonly method = HttpMethod.enum.get;
  readonly path = "/api/app/ping-model";
}

export const appPingModelService = new AppPingModelService(NoBodyParams, NoPathParams, AppPingModelResponse);
