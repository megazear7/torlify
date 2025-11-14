import z from "zod";

export const GenerateBookParameters = z.object({
  instructions: z.string(),
});
export type GenerateBookParameters = z.infer<typeof GenerateBookParameters>;
