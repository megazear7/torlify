import { Book } from "../shared/type.book.js";
import { saveBook } from "./util.book.js";
import { Chapter, ChapterOutline } from "../shared/type.book.js";
import { chapterDetailsPrompt } from "./prompt.chapter-details.js";
import { submitBookPrompt } from "./util.submit-prompt.js";
import { makeChapterOutlinePrompt } from "./prompt.make-chapter-outline.js";
import { charactersPrompt } from "./prompt.characters.js";
import { bookOverviewPrompt } from "./prompt.book-overview.js";
import { ChatCompletionMessageParam } from "openai/resources.js";
import { writtenChaptersPrompt } from "./prompt.written-chapters.js";

export async function generateChapterOutline(book: Book, chapter: Chapter): Promise<Chapter> {
  const messages: ChatCompletionMessageParam[] = [
    ...(await bookOverviewPrompt(book)),
    ...(await charactersPrompt(book)),
    ...(await writtenChaptersPrompt(book, chapter)),
    ...(await chapterDetailsPrompt(chapter)),
    ...(await makeChapterOutlinePrompt(chapter)),
  ];
  chapter.outline = await submitBookPrompt<ChapterOutline>(book, messages, ChapterOutline);
  chapter.parts = [];
  for (let i = 0; i < chapter.outline.length; i++) {
    chapter.parts.push({ number: i + 1, text: "" });
  }
  await saveBook(book);
  return chapter;
}
