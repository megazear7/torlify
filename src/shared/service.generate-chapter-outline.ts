import { AbstractService, NoBodyParams, ServiceType } from "./main.service.js";
import { HttpMethod } from "./type.http.js";
import { BookId, Chapter } from "./type.book.js";
import z from "zod";

export const GenerateChapterOutlinePathParameters = z.object({
  book: BookId,
  chapter: z.string(),
});
export type GenerateChapterOutlinePathParameters = z.infer<typeof GenerateChapterOutlinePathParameters>;

export class GenerateChapterOutlineService extends AbstractService<
  NoBodyParams,
  GenerateChapterOutlinePathParameters,
  Chapter
> {
  readonly type = ServiceType.enum.json;
  readonly method = HttpMethod.enum.post;
  readonly path = "/api/book/:book/chapter/:chapter/outline/generate";
}

export const generateChapterOutlineService = new GenerateChapterOutlineService(
  NoBodyParams,
  GenerateChapterOutlinePathParameters,
  Chapter,
);
