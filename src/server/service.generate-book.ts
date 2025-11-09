import { ChatCompletionMessageParam } from "openai/resources";
import { Book } from "../shared/type.book.js";
import { submitPrompt } from "./service.submit-prompt.js";
import { generateBookPrompt } from "./prompt.generate-book.js";
import { modelNames } from "./service.model.js";

export const generateBookService = async (): Promise<Book> => {
  const availableModelNames = await modelNames();
  const messages: ChatCompletionMessageParam[] = [
    ...(await generateBookPrompt()),
  ];
  const book: Book = await submitPrompt<Book>(messages);
  book.model.text.name = availableModelNames[0];
  book.model.audio.name = availableModelNames[0];
  book.model.text.cost.inputTokenCost = 3;
  book.model.text.cost.outputTokenCost = 15;
  return book;
};
