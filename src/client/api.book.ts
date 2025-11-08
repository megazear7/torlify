import { Book, BookId } from "../shared/type.book.js";

export async function bookApi(id: BookId): Promise<Book> {
  return Book.parse(await (await fetch(`/book/${id}`)).json());
}
