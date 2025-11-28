import { NoBodyParams, RequestOptions } from "../shared/main.service.js";
import {
  DeleteBookPathParameters,
  deleteBookService,
  DeleteBookResponse
} from "../shared/service.delete-book.js";
import { AbstractController } from "./main.controller.js";
import { getBook } from "./util.book.js";
import { RouteError } from "./util.route.js";
import { promises as fs } from "fs";

export class DeleteBookController extends AbstractController<
  NoBodyParams,
  DeleteBookPathParameters,
  DeleteBookResponse
> {
  async handler({
    pathParams,
  }: RequestOptions<NoBodyParams, DeleteBookPathParameters>): Promise<DeleteBookResponse> {
    const book = await getBook(pathParams.bookId);
    if (!book) throw new RouteError(404, "Book not found");
    const path = `data/books/${pathParams.bookId}`;
    await fs.rm(path, { recursive: true, force: true });
    return true;
  }
}

export const deleteBookController = new DeleteBookController(deleteBookService);
