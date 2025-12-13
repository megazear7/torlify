import { AbstractService, NoBodyParams, NoPathParams, ServiceType } from "./main.service.js";
import { HttpMethod } from "./type.http.js";
import { PromptLog } from "./type.prompt-log.js";

export class ListPromptLogsService extends AbstractService<NoBodyParams, NoPathParams, PromptLog[]> {
  readonly type = ServiceType.enum.json;
  readonly method = HttpMethod.enum.get;
  readonly path = "/api/prompt-logs";
}

export const listPromptLogsService = new ListPromptLogsService(NoBodyParams, NoPathParams, PromptLog.array());