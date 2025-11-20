import { RequestOptions } from "../shared/main.service.js";
import {
  UpdateBookBodyParameters,
  UpdateBookPathParameters,
  updateBookService,
} from "../shared/service.update-book.js";
import { Book } from "../shared/type.book.js";
import { AbstractController } from "./main.controller.js";
import { getBook, saveBook } from "./util.book.js";

export class UpdateBookController extends AbstractController<
  UpdateBookBodyParameters,
  UpdateBookPathParameters,
  Book
> {
  async handler({
    bodyParams,
    pathParams,
  }: RequestOptions<
    UpdateBookBodyParameters,
    UpdateBookPathParameters
  >): Promise<Book> {
    const existingBook = await getBook(pathParams.name);
    const updatedBook = { ...existingBook, ...bodyParams.book };
    await saveBook(updatedBook);
    return updatedBook;
  }
}

export const updateBookController = new UpdateBookController(updateBookService);
