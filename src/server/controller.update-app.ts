import { RequestOptions } from "../shared/main.service.js";
import { UpdateAppBodyParameters, UpdateAppPathParameters, updateAppService } from "../shared/service.update-app.js";
import { AppConfig } from "../shared/type.app.js";
import { mergeAppProperties } from "../shared/util.merge-app.js";
import { AbstractController } from "./main.controller.js";
import { getApp, saveApp } from "./util.app.js";

export class UpdateAppController extends AbstractController<
  UpdateAppBodyParameters,
  UpdateAppPathParameters,
  AppConfig
> {
  async handler({ bodyParams }: RequestOptions<UpdateAppBodyParameters, UpdateAppPathParameters>): Promise<AppConfig> {
    const existingApp = await getApp();
    const updatedApp = mergeAppProperties(existingApp, bodyParams.app);
    await saveApp(updatedApp);
    return updatedApp;
  }
}

export const updateAppController = new UpdateAppController(updateAppService);
