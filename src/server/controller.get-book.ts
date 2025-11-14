import { NoBodyParams, RequestOptions } from "../shared/main.service.js";
import { GetBookPathParameters, getBookService } from "../shared/service.get-book.js";
import { Book } from "../shared/type.book.js";
import { AbstractController } from "./main.controller.js";
import { getBook } from "./util.book.js";

export class GetBookController extends AbstractController<
  NoBodyParams,
  GetBookPathParameters,
  Book
> {
  async handler({
    pathParams,
  }: RequestOptions<undefined, GetBookPathParameters>): Promise<Book> {
    return getBook(pathParams.bookId);
  }
}

export const getBookController = new GetBookController(getBookService);
