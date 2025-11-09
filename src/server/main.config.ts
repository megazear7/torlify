import { z } from 'zod';

export const ModelConfig = z.object({
    name: z.string().min(1, 'model name is required'),
    id: z.string().min(1, 'model id is required'),
    url: z.string().min(1, 'base url is required'),
});

export const Config = z.object({
    models: ModelConfig.array(),
});
export type ConfigType = z.infer<typeof Config>;
