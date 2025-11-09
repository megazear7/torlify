import { Request, Response } from "express";
import { bookService, booksService } from "./service.book.js";
import { parseRouteParams } from "../shared/util.route-params.js";
import { AbstractController } from "./main.controller.js";

export class BookController extends AbstractController {
  readonly path = "/api/book/:bookId";

  async handler(req: Request, res: Response): Promise<void> {
    const params = parseRouteParams(this.path, req.path);
    const book = await bookService(params.bookId);
    res.json(book);
  }
}

export class BooksController extends AbstractController {
  readonly path = "/api/books";

  async handler(_req: Request, res: Response): Promise<void> {
    res.json(await booksService());
  }
}
