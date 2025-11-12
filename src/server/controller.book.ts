import { Request, Response } from "express";
import { getBook, getBooks } from "./service.book.js";
import { parseRouteParams } from "../shared/util.route-params.js";
import { AbstractController } from "./main.controller.js";
import { HttpMethod } from "../shared/type.http.js";
import { generateBook } from "./service.generate-book.js";

export class BooksController extends AbstractController {
  readonly method = HttpMethod.enum.get;
  readonly path = "/api/books";

  async handler(_req: Request, res: Response): Promise<void> {
    res.json(await getBooks());
  }
}

export class BookController extends AbstractController {
  readonly method = HttpMethod.enum.get;
  readonly path = "/api/book/:bookId";

  async handler(req: Request, res: Response): Promise<void> {
    const params = parseRouteParams(this.path, req.path);
    const book = await getBook(params.bookId);
    res.json(book);
  }
}

export class GenerateEmptyBookController extends AbstractController {
  readonly method = HttpMethod.enum.post;
  readonly path = "/api/book/generate";

  async handler(_req: Request, res: Response): Promise<void> {
    res.json(await generateBook());
  }
}
