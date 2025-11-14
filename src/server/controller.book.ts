import { getBook, getBooks } from "./service.book.js";
import { AbstractController, RequestOptions } from "./main.controller.js";
import { HttpMethod } from "../shared/type.http.js";
import { generateBook } from "./service.generate-book.js";
import { GenerateBookParameters } from "../shared/type.request.generate-book.js";
import { GetBookPathParameters } from "../shared/type.request.get-book.js";
import { Book, BookMinimalInfoList } from "../shared/type.book.js";

export class BooksController extends AbstractController<
  undefined,
  undefined,
  BookMinimalInfoList
> {
  readonly method = HttpMethod.enum.get;
  readonly path = "/api/books";

  async handler(): Promise<BookMinimalInfoList> {
    return await getBooks();
  }
}

export class BookController extends AbstractController<
  undefined,
  GetBookPathParameters,
  Book
> {
  readonly method = HttpMethod.enum.get;
  readonly path = "/api/book/:bookId";

  async handler({
    pathParams,
  }: RequestOptions<undefined, GetBookPathParameters>): Promise<Book> {
    return await getBook(pathParams.bookId);
  }
}

export class GenerateEmptyBookController extends AbstractController<
  GenerateBookParameters,
  undefined,
  Book
> {
  readonly method = HttpMethod.enum.post;
  readonly path = "/api/book/generate";

  async handler({
    bodyParams,
  }: RequestOptions<GenerateBookParameters, undefined>): Promise<Book> {
    return await generateBook(bodyParams);
  }
}
