import { AbstractService, NoBodyParams, ServiceType } from "./main.service.js";
import { HttpMethod } from "./type.http.js";
import { BookId, ChapterPart } from "./type.book.js";
import z from "zod";

export const GeneratePartAudioPathParameters = z.object({
  book: BookId,
  chapter: z.string(),
  part: z.string(),
});
export type GeneratePartAudioPathParameters = z.infer<typeof GeneratePartAudioPathParameters>;

export class GeneratePartAudioService extends AbstractService<
  NoBodyParams,
  GeneratePartAudioPathParameters,
  ChapterPart
> {
  readonly type = ServiceType.enum.json;
  readonly method = HttpMethod.enum.post;
  readonly path = "/api/book/:book/chapter/:chapter/part/:part/generate/audio";
}

export const generatePartAudioService = new GeneratePartAudioService(
  NoBodyParams,
  GeneratePartAudioPathParameters,
  ChapterPart,
);
