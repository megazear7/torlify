import { ChatCompletionMessageParam } from "openai/resources";
import { Book } from "../shared/type.book.js";
import { submitPrompt } from "./util.submit-prompt.js";
import { generateBookPrompt } from "./prompt.generate-book.js";
import { readAppConfig } from "./service.app-config.js";
import { saveBook } from "./util.book.js";
import { GenerateBookParameters } from "../shared/service.generate-book.js";

export const generateBook = async (params: GenerateBookParameters): Promise<Book> => {
  const appConfig = await readAppConfig();
  const messages: ChatCompletionMessageParam[] = [...(await generateBookPrompt(params))];
  const book: Book = await submitPrompt<Book>(messages, Book);
  book.model.text = appConfig.model.text;
  book.model.audio = appConfig.model.audio;
  await saveBook(book);
  return book;
};
