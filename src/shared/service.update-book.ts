import { AbstractService, ServiceType } from "./main.service.js";
import { HttpMethod } from "./type.http.js";
import { Book, BookId } from "./type.book.js";
import z from "zod";

export const UpdateBookPathParameters = z.object({
  name: BookId,
});
export type UpdateBookPathParameters = z.infer<typeof UpdateBookPathParameters>;

export const UpdateBookBodyParameters = z.object({
  book: Book.partial(),
});
export type UpdateBookBodyParameters = z.infer<typeof UpdateBookBodyParameters>;

export class UpdateBookService extends AbstractService<
  UpdateBookBodyParameters,
  UpdateBookPathParameters,
  Book
> {
  readonly type = ServiceType.enum.json;
  readonly method = HttpMethod.enum.put;
  readonly path = "/api/book/:name";
}
export const updateBookService = new UpdateBookService(
  UpdateBookBodyParameters,
  UpdateBookPathParameters,
  Book,
);
