import { ChatCompletionMessageParam } from "openai/resources.js";
import { NoPathParams, RequestOptions } from "../shared/main.service.js";
import {
  GenerateBookParameters,
  generateBookService,
} from "../shared/service.generate-book.js";
import { Book, BookNoParts } from "../shared/type.book.js";
import { AbstractController } from "./main.controller.js";
import { readAppConfig } from "./service.app-config.js";
import { generateBookPrompt } from "./prompt.generate-book.js";
import { saveBook } from "./util.book.js";
import { submitPrompt } from "./util.submit-prompt.js";

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
    const bookNoParts: BookNoParts = await submitPrompt<BookNoParts>(
      messages,
      BookNoParts,
    );
    const book: Book = bookNoParts as Book;
    for (const chapter of book.chapters) {
      if (chapter.outline.length < chapter.minParts) chapter.minParts = chapter.outline.length;
      if (chapter.outline.length > chapter.maxParts) chapter.maxParts = chapter.outline.length;
      for (let i = 0; i < chapter.outline.length; i++) {
        chapter.parts[i] = {
          number: i + 1,
          text: "",
        };
      }
    }
    book.model.text = appConfig.model.text;
    book.model.audio = appConfig.model.audio;
    await saveBook(book);
    return book;
  }
}

export const generateBookController = new GenerateBookController(
  generateBookService,
);
