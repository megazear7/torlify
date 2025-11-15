import { ChatCompletionMessageParam } from "openai/resources.js";
import { NoPathParams, RequestOptions } from "../shared/main.service.js";
import {
  GenerateBookParameters,
  generateBookService,
} from "../shared/service.generate-book.js";
import { Book } from "../shared/type.book.js";
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
    const book: Book = await submitPrompt<Book>(messages, Book);
    book.model.text = appConfig.model.text;
    book.model.audio = appConfig.model.audio;
    await saveBook(book);
    return book;
  }
}

export const generateBookController = new GenerateBookController(
  generateBookService,
);
