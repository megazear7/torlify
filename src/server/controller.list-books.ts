import { NoBodyParams, NoPathParams } from "../shared/main.service.js";
import { listBooksService } from "../shared/service.list-books.js";
import { BookMinimalInfoList } from "../shared/type.book.js";
import { AbstractController } from "./main.controller.js";
import { listBooks } from "./util.book.js";

export class ListBooksController extends AbstractController<
  NoBodyParams,
  NoPathParams,
  BookMinimalInfoList
> {
  async handler(): Promise<BookMinimalInfoList> {
    return await listBooks();
  }
}

export const listBooksController = new ListBooksController(listBooksService);
