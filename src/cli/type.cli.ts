import z from "zod";

export const ModelTypeOption = z.enum(["grok", "openai", "custom"]);
export type ModelTypeOption = z.infer<typeof ModelTypeOption>;
