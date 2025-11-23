import { AbstractService, ServiceType } from "./main.service.js";
import { HttpMethod } from "./type.http.js";
import { BookId, Chapter, ChapterPartial } from "./type.book.js";
import z from "zod";

export const UpdateChapterPathParameters = z.object({
  book: BookId,
});
export type UpdateChapterPathParameters = z.infer<
  typeof UpdateChapterPathParameters
>;

export const UpdateChapterBodyParameters = z.object({
  chapter: ChapterPartial,
});
export type UpdateChapterBodyParameters = z.infer<
  typeof UpdateChapterBodyParameters
>;

export class UpdateChapterService extends AbstractService<
  UpdateChapterBodyParameters,
  UpdateChapterPathParameters,
  Chapter
> {
  readonly type = ServiceType.enum.json;
  readonly method = HttpMethod.enum.put;
  readonly path = "/api/book/:book/chapter";
}
export const updateChapterService = new UpdateChapterService(
  UpdateChapterBodyParameters,
  UpdateChapterPathParameters,
  Chapter,
);
