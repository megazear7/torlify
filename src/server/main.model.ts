import OpenAI from "openai";
import { promises as fs } from "fs";
import z from "zod";
import { getEnvVariable } from "./main.env.js";
import { Config, ModelConfig } from "./main.config.js";

export const ClientModel = ModelConfig.extend({
    client: z.instanceof(OpenAI),
});
export type ClientModel = z.infer<typeof ClientModel>;

export const loadClientModels = () => fs.readFile('config.json', 'utf-8')
    .then(data => JSON.parse(data))
    .then(json => Config.parse(json))
    .then(config => config.models)
    .then(models => models.map(model => ({
        name: model.name,
        id: model.id,
        url: model.url,
        client: new OpenAI({ baseURL: model.url, apiKey: getEnvVariable(`${model.name.toUpperCase()}_MODEL_API_KEY`) }),
    })));
