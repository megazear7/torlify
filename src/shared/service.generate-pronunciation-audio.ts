import { AbstractService, ServiceType } from "./main.service.js";
import { HttpMethod } from "./type.http.js";
import { BookId } from "./type.book.js";
import z from "zod";

export const GeneratePronunciationAudioBodyParams = z.object({
  text: z.string(),
});
export type GeneratePronunciationAudioBodyParams = z.infer<typeof GeneratePronunciationAudioBodyParams>;

export const GeneratePronunciationAudioPathParameters = z.object({
  book: BookId,
});
export type GeneratePronunciationAudioPathParameters = z.infer<typeof GeneratePronunciationAudioPathParameters>;

export const GeneratePronunciationAudioResponse = z.object({
  audioData: z.string(), // base64 encoded audio
});
export type GeneratePronunciationAudioResponse = z.infer<typeof GeneratePronunciationAudioResponse>;

export class GeneratePronunciationAudioService extends AbstractService<
  GeneratePronunciationAudioBodyParams,
  GeneratePronunciationAudioPathParameters,
  GeneratePronunciationAudioResponse
> {
  readonly type = ServiceType.enum.json;
  readonly method = HttpMethod.enum.post;
  readonly path = "/api/book/:book/generate/pronunciation/audio";
}

export const generatePronunciationAudioService = new GeneratePronunciationAudioService(
  GeneratePronunciationAudioBodyParams,
  GeneratePronunciationAudioPathParameters,
  GeneratePronunciationAudioResponse,
);
