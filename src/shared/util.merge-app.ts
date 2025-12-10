import { AppConfig, AppConfigPartial } from "./type.app";

export function mergeAppProperties(existingApp: AppConfig, newAppData: AppConfigPartial): AppConfig {
  return {
    ...existingApp,
    ...newAppData,
    model: {
      ...existingApp.model,
      ...newAppData.model,
      text: {
        ...existingApp.model.text,
        ...newAppData.model?.text,
        cost: {
          ...existingApp.model.text.cost,
          ...newAppData.model?.text?.cost,
        },
        usage: {
          ...existingApp.model.text.usage,
          ...newAppData.model?.text?.usage,
        },
      },
      audio: {
        ...existingApp.model.audio,
        ...newAppData.model?.audio,
        cost: {
          ...existingApp.model.audio.cost,
          ...newAppData.model?.audio?.cost,
        },
        usage: {
          ...existingApp.model.audio.usage,
          ...newAppData.model?.audio?.usage,
        },
      },
    },
  };
}
