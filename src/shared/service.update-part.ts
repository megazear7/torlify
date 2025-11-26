import { AbstractService, ServiceType } from "./main.service.js";
import { HttpMethod } from "./type.http.js";
import { BookId, ChapterPart } from "./type.book.js";
import z from "zod";

export const UpdatePartPathParameters = z.object({
  book: BookId,
  chapter: z.string(),
});
export type UpdatePartPathParameters = z.infer<typeof UpdatePartPathParameters>;

export const UpdatePartBodyParameters = z.object({
  part: ChapterPart,
});
export type UpdatePartBodyParameters = z.infer<typeof UpdatePartBodyParameters>;

export class UpdatePartService extends AbstractService<
  UpdatePartBodyParameters,
  UpdatePartPathParameters,
  ChapterPart
> {
  readonly type = ServiceType.enum.json;
  readonly method = HttpMethod.enum.post;
  readonly path = "/api/book/:book/chapter/:chapter/part";
}
export const updatePartService = new UpdatePartService(
  UpdatePartBodyParameters,
  UpdatePartPathParameters,
  ChapterPart,
);
