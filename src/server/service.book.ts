import { Book, BookId } from "../shared/type.book.js";
import { promises as fs } from "fs";
import { fileExists } from "./util.fs.js";
import { RouteError } from "./util.route.js";

export const bookService = async (id: BookId): Promise<Book> => {
  const path = `books/${id}/index.json`;
  const exists = await fileExists(path);
  if (!exists) throw new RouteError(404, `Book with id ${id} does not exist.`);
  const data = await fs.readFile(path, "utf-8");
  return Book.parse(data);
};
