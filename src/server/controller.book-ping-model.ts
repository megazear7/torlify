import { ChatCompletionMessageParam } from "openai/resources.js";
import { NoBodyParams, RequestOptions } from "../shared/main.service.js";
import {
  BookPingModelResponse,
  bookPingModelService,
  BookPingModelPathParams,
} from "../shared/service.book-ping-model.js";
import { AbstractController } from "./main.controller.js";
import { submitBookPrompt } from "./util.submit-prompt.js";
import { getBook } from "./util.book.js";

export class BookPingModelController extends AbstractController<
  NoBodyParams,
  BookPingModelPathParams,
  BookPingModelResponse
> {
  async handler({ pathParams }: RequestOptions<NoBodyParams, BookPingModelPathParams>): Promise<BookPingModelResponse> {
    const book = await getBook(pathParams.book);
    const messages: ChatCompletionMessageParam[] = [
      { role: "user", content: "Please reply with the exact text: 'The text model is connected'" },
    ];
    return await submitBookPrompt<string>(book, messages);
  }
}

export const bookPingModelController = new BookPingModelController(bookPingModelService);
