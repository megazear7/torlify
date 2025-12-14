import { NoBodyParams, NoPathParams } from "../shared/main.service.js";
import { listPromptLogsService } from "../shared/service.list-prompt-logs.js";
import { PromptLog } from "../shared/type.prompt-log.js";
import { AbstractController } from "./main.controller.js";
import { listPromptLogs } from "./util.prompt-log.js";

export class ListPromptLogsController extends AbstractController<NoBodyParams, NoPathParams, PromptLog[]> {
  async handler(): Promise<PromptLog[]> {
    return await listPromptLogs();
  }
}

export const listPromptLogsController = new ListPromptLogsController(listPromptLogsService);
