import { BookId, ChapterNumber, ChapterPartNumber } from "../shared/type.book";
import { getBook } from "./util.book.js";
import { RouteError } from "./util.route.js";

export async function getPartAudioPath(
  bookId: BookId,
  chapter: ChapterNumber,
  part: ChapterPartNumber,
): Promise<string> {
  const book = await getBook(bookId);
  if (!book) {
    throw new RouteError(404, "Book not found");
  }
  const audioId = book.chapters.find((ch) => ch.number === chapter)?.parts.find((p) => p.number === part)?.audio;

  if (!audioId) {
    throw new RouteError(404, "Audio file not found");
  }

  return `data/books/${bookId}/audio/${audioId}.mp3`;
}
