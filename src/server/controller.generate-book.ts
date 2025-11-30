import { ChatCompletionMessageParam } from "openai/resources.js";
import { NoPathParams, RequestOptions } from "../shared/main.service.js";
import {
  GenerateBookParameters,
  generateBookService,
} from "../shared/service.generate-book.js";
import { Book, BookStub } from "../shared/type.book.js";
import { AbstractController } from "./main.controller.js";
import { readAppConfig } from "./service.app-config.js";
import { generateBookPrompt } from "./prompt.generate-book.js";
import { saveBook } from "./util.book.js";
import { submitPrompt } from "./util.submit-prompt.js";
import { generateChapterOutline } from "./util.generate-chapter-outline.js";

export class GenerateBookController extends AbstractController<
  GenerateBookParameters,
  NoPathParams,
  Book
> {
  async handler({
    bodyParams,
  }: RequestOptions<GenerateBookParameters, NoPathParams>): Promise<Book> {
    const appConfig = await readAppConfig();
    const messages: ChatCompletionMessageParam[] = [
      ...(await generateBookPrompt(bodyParams)),
    ];
    const bookStub: BookStub = await submitPrompt<BookStub>(messages, BookStub);
    const book: Book = {
      ...bookStub,
      chapters: bookStub.chapters.map((chapter) => ({
        ...chapter,
        outline: [],
        parts: [],
      })),
      model: {
        text: {
          ...appConfig.model.text,
          usage: {
            completion_tokens: 0,
            prompt_tokens: 0,
          },
        },
        audio: {
          ...appConfig.model.audio,
          usage: {
            completion_tokens: 0,
            prompt_tokens: 0,
          },
        },
      },
    };
    for (const chapter of book.chapters) {
      await generateChapterOutline(book, chapter);
    }
    await saveBook(book);
    return book;
  }
}

export const generateBookController = new GenerateBookController(
  generateBookService,
);
