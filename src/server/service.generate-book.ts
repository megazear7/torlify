import { ChatCompletionMessageParam } from "openai/resources";
import { Book } from "../shared/type.book.js";
import { submitPrompt } from "./service.submit-prompt.js";
import { generateBookPrompt } from "./prompt.generate-book.js";
import { readAppConfig } from "./service.app-config.js";
import { saveBookService } from "./service.book.js";

export const generateBookService = async (): Promise<Book> => {
  const appConfig = await readAppConfig();
  const messages: ChatCompletionMessageParam[] = [
    ...(await generateBookPrompt()),
  ];
  const book: Book = await submitPrompt<Book>(messages, Book);
  book.model.text = appConfig.model.text;
  book.model.audio = appConfig.model.audio;
  await saveBookService(book);
  return book;
};
