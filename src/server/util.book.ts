import { Book, BookId, BookMinimalInfoList } from "../shared/type.book.js";
import { promises as fs } from "fs";
import { fileExists } from "./util.fs.js";
import { RouteError } from "./util.route.js";

export const getBook = async (id: BookId): Promise<Book> => {
  const path = `data/books/${id}/index.json`;
  const exists = await fileExists(path);
  if (!exists) throw new RouteError(404, `Book with id ${id} does not exist.`);
  const data = await fs.readFile(path, "utf-8");
  const json = JSON.parse(data);
  const book = Book.parse(json);
  for (const chapter of book.chapters) {
    if (!chapter.parts || chapter.parts.length === 0) {
      for (let i = 0; i < (chapter.minParts || 1); i++) {
        chapter.parts.push({
          text: "",
          number: 1,
        });
      }
    }
  }
  return book;
};

export const listBooks = async (): Promise<BookMinimalInfoList> => {
  await fs.mkdir("data/books", { recursive: true });
  const paths = await fs.readdir("data/books");
  return await Promise.all(
    paths
      .filter((id) => !id.startsWith("."))
      .map(async (id) => {
        const book = await getBook(BookId.parse(id));
        return {
          id: BookId.parse(id),
          title: book.title,
        };
      }),
  );
};

export const saveBook = async (book: Book): Promise<void> => {
  const path = `data/books/${book.id}`;
  await fs.mkdir(path, { recursive: true });
  await fs.mkdir(`${path}/audio`, { recursive: true });
  await fs.mkdir(`${path}/references`, { recursive: true });
  await fs.writeFile(
    `${path}/index.json`,
    JSON.stringify(book, null, 2),
    "utf-8",
  );
};
