import { Book, ChapterPart, ChapterPartDescription } from "../shared/type.book.js";
import { saveBook } from "./util.book.js";
import { Chapter } from "../shared/type.book.js";
import { chapterDetailsPrompt } from "./prompt.chapter-details.js";
import { submitBookPrompt } from "./util.submit-prompt.js";
import { makePartOutlinePrompt } from "./prompt.make-part-outline.js";
import { charactersPrompt } from "./prompt.characters.js";
import { bookOverviewPrompt } from "./prompt.book-overview.js";
import { ChatCompletionMessageParam } from "openai/resources.js";
import { writtenChaptersPrompt } from "./prompt.written-chapters.js";

export async function generatePartOutline(book: Book, chapter: Chapter, part: ChapterPart): Promise<Chapter> {
  const messages: ChatCompletionMessageParam[] = [
    ...(await bookOverviewPrompt(book)),
    ...(await charactersPrompt(book)),
    ...(await writtenChaptersPrompt(book, chapter)),
    ...(await chapterDetailsPrompt(chapter)),
    ...(await makePartOutlinePrompt(chapter, part)),
  ];
  const partDescription = await submitBookPrompt<ChapterPartDescription>(book, messages, ChapterPartDescription);
  console.log("Generated part description:", partDescription);
  chapter.outline[part.number - 1] = partDescription;
  await saveBook(book);
  return chapter;
}
