import { AbstractService, NoBodyParams, ServiceType } from "./main.service.js";
import { HttpMethod } from "./type.http.js";
import { Book, BookId } from "./type.book.js";
import z from "zod";

export const GenerateBookTitleAudioPathParameters = z.object({
  book: BookId,
});
export type GenerateBookTitleAudioPathParameters = z.infer<typeof GenerateBookTitleAudioPathParameters>;

export class GenerateBookTitleAudioService extends AbstractService<
  NoBodyParams,
  GenerateBookTitleAudioPathParameters,
  Book
> {
  readonly type = ServiceType.enum.json;
  readonly method = HttpMethod.enum.post;
  readonly path = "/api/book/:book/generate/title/audio";
}

export const generateBookTitleAudioService = new GenerateBookTitleAudioService(
  NoBodyParams,
  GenerateBookTitleAudioPathParameters,
  Book,
);
