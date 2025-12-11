import { ChatCompletionMessageParam } from "openai/resources.js";
import { NoBodyParams, NoPathParams } from "../shared/main.service.js";
import { AppPingModelResponse, appPingModelService } from "../shared/service.app-ping-model.js";
import { AbstractController } from "./main.controller.js";
import { submitPrompt } from "./util.submit-prompt.js";

export class AppPingModelController extends AbstractController<NoBodyParams, NoPathParams, AppPingModelResponse> {
  async handler(): Promise<AppPingModelResponse> {
    const messages: ChatCompletionMessageParam[] = [
      { role: "user", content: "Please reply with the exact text: 'The text model is connected'" },
    ];
    return await submitPrompt<string>(messages);
  }
}

export const appPingModelController = new AppPingModelController(appPingModelService);
