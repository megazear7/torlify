import { AbstractService, ServiceType } from "./main.service.js";
import { HttpMethod } from "./type.http.js";
import { Book, BookId } from "./type.book.js";
import z from "zod";

export const GetBookPathParameters = z.object({
  bookId: BookId,
});
export type GetBookPathParameters = z.infer<typeof GetBookPathParameters>;

export class GetBookService extends AbstractService<
  undefined,
  GetBookPathParameters,
  Book
> {
  readonly type = ServiceType.enum.json;
  readonly method = HttpMethod.enum.get;
  readonly path = "/api/book/:bookId";
}
export const getBookService = new GetBookService(z.undefined(), GetBookPathParameters, Book);
