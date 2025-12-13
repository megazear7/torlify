import { AbstractService, NoBodyParams, ServiceType } from "./main.service.js";
import { HttpMethod } from "./type.http.js";
import { Book, BookId } from "./type.book.js";
import z from "zod";

export const DeleteBookTitleAudioPathParameters = z.object({
  book: BookId,
});
export type DeleteBookTitleAudioPathParameters = z.infer<typeof DeleteBookTitleAudioPathParameters>;

export class DeleteBookTitleAudioService extends AbstractService<
  NoBodyParams,
  DeleteBookTitleAudioPathParameters,
  Book
> {
  readonly type = ServiceType.enum.json;
  readonly method = HttpMethod.enum.delete;
  readonly path = "/api/book/:book/title/audio";
}

export const deleteBookTitleAudioService = new DeleteBookTitleAudioService(
  NoBodyParams,
  DeleteBookTitleAudioPathParameters,
  Book,
);
