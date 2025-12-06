import { AbstractService, NoBodyParams, ServiceType } from "./main.service.js";
import { HttpMethod } from "./type.http.js";
import { BookId } from "./type.book.js";
import z from "zod";

export const DeleteBookResponse = z.boolean();
export type DeleteBookResponse = z.infer<typeof DeleteBookResponse>;

export const DeleteBookPathParameters = z.object({
  bookId: BookId,
});
export type DeleteBookPathParameters = z.infer<typeof DeleteBookPathParameters>;

export class DeleteBookService extends AbstractService<NoBodyParams, DeleteBookPathParameters, DeleteBookResponse> {
  readonly type = ServiceType.enum.json;
  readonly method = HttpMethod.enum.delete;
  readonly path = "/api/book/:bookId";
}
export const deleteBookService = new DeleteBookService(NoBodyParams, DeleteBookPathParameters, DeleteBookResponse);
