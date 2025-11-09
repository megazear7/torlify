import { Request, Response } from "express";
import { bookService } from "./service.book.js";
import { parseRouteParams } from "../shared/util.route-params.js";

export const bookPath = "/api/book/:bookId";

export const bookController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const params = parseRouteParams(bookPath, req.path);
  const book = await bookService(params.bookId);
  res.json(book);
};
