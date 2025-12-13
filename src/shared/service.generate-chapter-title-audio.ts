import { AbstractService, NoBodyParams, ServiceType } from "./main.service.js";
import { HttpMethod } from "./type.http.js";
import { BookId, Chapter } from "./type.book.js";
import z from "zod";

export const GenerateChapterTitleAudioPathParameters = z.object({
  book: BookId,
  chapter: z.string(),
});
export type GenerateChapterTitleAudioPathParameters = z.infer<typeof GenerateChapterTitleAudioPathParameters>;

export class GenerateChapterTitleAudioService extends AbstractService<
  NoBodyParams,
  GenerateChapterTitleAudioPathParameters,
  Chapter
> {
  readonly type = ServiceType.enum.json;
  readonly method = HttpMethod.enum.post;
  readonly path = "/api/book/:book/chapter/:chapter/generate/title/audio";
}

export const generateChapterTitleAudioService = new GenerateChapterTitleAudioService(
  NoBodyParams,
  GenerateChapterTitleAudioPathParameters,
  Chapter,
);
