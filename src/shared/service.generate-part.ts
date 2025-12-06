import { AbstractService, NoBodyParams, ServiceType } from "./main.service.js";
import { HttpMethod } from "./type.http.js";
import { BookId, ChapterPart } from "./type.book.js";
import z from "zod";

export const GeneratePartPathParameters = z.object({
  book: BookId,
  chapter: z.string(),
  part: z.string(),
});
export type GeneratePartPathParameters = z.infer<typeof GeneratePartPathParameters>;

export class GeneratePartService extends AbstractService<NoBodyParams, GeneratePartPathParameters, ChapterPart> {
  readonly type = ServiceType.enum.json;
  readonly method = HttpMethod.enum.post;
  readonly path = "/api/book/:book/chapter/:chapter/part/:part/generate";
}

export const generatePartService = new GeneratePartService(NoBodyParams, GeneratePartPathParameters, ChapterPart);
