import { Book, BookId, BookMinimalInfo } from "../shared/type.book.js";

export async function bookApi(id: BookId): Promise<Book> {
  return Book.parse(await (await fetch(`/api/book/${id}`)).json());
}

export async function booksApi(): Promise<BookMinimalInfo[]> {
  return BookMinimalInfo.array().parse(
    await (await fetch(`/api/books`)).json(),
  );
}

export async function generateBookApi(): Promise<Book> {
  return Book.parse(
    await (await fetch(`/api/book/generate`, { method: "POST" })).json(),
  );
}
