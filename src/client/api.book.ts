import { Book, BookId, BookMinimalInfo } from "../shared/type.book.js";
import { GenerateBookParameters } from "../shared/type.request.generate-book.js";

export async function bookApi(id: BookId): Promise<Book> {
  return Book.parse(await (await fetch(`/api/book/${id}`)).json());
}

export async function booksApi(): Promise<BookMinimalInfo[]> {
  return BookMinimalInfo.array().parse(
    await (await fetch(`/api/books`)).json(),
  );
}

export async function generateBookApi(
  params: GenerateBookParameters,
): Promise<Book> {
  return Book.parse(
    await (
      await fetch(`/api/book/generate`, {
        method: "POST",
        body: JSON.stringify(params),
        headers: {
          "Content-Type": "application/json",
        },
      })
    ).json(),
  );
}
