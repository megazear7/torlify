import { NoBodyParams, RequestOptions } from "../shared/main.service.js";
import { Chapter, ChapterOutline } from "../shared/type.book.js";
import { AbstractController } from "./main.controller.js";
import {
  GenerateChapterOutlinePathParameters,
  generateChapterOutlineService,
} from "../shared/service.generate-chapter-outline.js";
import { charactersPrompt } from "./prompt.characters.js";
import { bookOverviewPrompt } from "./prompt.book-overview.js";
import { ChatCompletionMessageParam } from "openai/resources.js";
import { writtenChaptersPrompt } from "./prompt.written-chapters.js";
import { getBook, saveBook } from "./util.book.js";
import { chapterDetailsPrompt } from "./prompt.chapter-details.js";
import { submitBookPrompt } from "./util.submit-prompt.js";
import { makeChapterOutlinePrompt } from "./prompt.make-chapter-outline.js";

export class GenerateChapterOutlineController extends AbstractController<
  NoBodyParams,
  GenerateChapterOutlinePathParameters,
  Chapter
> {
  async handler({
    pathParams,
  }: RequestOptions<
    NoBodyParams,
    GenerateChapterOutlinePathParameters
  >): Promise<Chapter> {
    const book = await getBook(pathParams.book);
    if (!book) {
      throw new Error("Book not found");
    }
    const chapter = book.chapters.find(
      (c) => c.number === parseInt(pathParams.chapter),
    );
    if (!chapter) {
      throw new Error("Chapter not found");
    }
    const messages: ChatCompletionMessageParam[] = [
      ...(await bookOverviewPrompt(book)),
      ...(await charactersPrompt(book)),
      ...(await writtenChaptersPrompt(book, chapter)),
      ...(await chapterDetailsPrompt(chapter)),
      ...(await makeChapterOutlinePrompt(chapter)),
    ];
    chapter.outline = await submitBookPrompt<ChapterOutline>(
      book,
      messages,
      ChapterOutline,
    );
    chapter.parts = [];
    for (let i = 0; i < chapter.outline.length; i++) {
      chapter.parts.push({ number: i + 1, text: "" });
    }
    await saveBook(book);
    return chapter;
  }
}

export const generateChapterOutlineController =
  new GenerateChapterOutlineController(generateChapterOutlineService);
