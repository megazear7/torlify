import { AbstractService, NoBodyParams, ServiceType } from "./main.service.js";
import { HttpMethod } from "./type.http.js";
import { BookId, Chapter } from "./type.book.js";
import z from "zod";

export const GeneratePartOutlinePathParameters = z.object({
  book: BookId,
  chapter: z.string(),
  part: z.string(),
});
export type GeneratePartOutlinePathParameters = z.infer<typeof GeneratePartOutlinePathParameters>;

export class GeneratePartOutlineService extends AbstractService<
  NoBodyParams,
  GeneratePartOutlinePathParameters,
  Chapter
> {
  readonly type = ServiceType.enum.json;
  readonly method = HttpMethod.enum.post;
  readonly path = "/api/book/:book/chapter/:chapter/part/:part/outline/generate";
}

export const generatePartOutlineService = new GeneratePartOutlineService(
  NoBodyParams,
  GeneratePartOutlinePathParameters,
  Chapter,
);
