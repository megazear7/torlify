import { Book } from "../shared/type.book.js";
import { saveBook } from "./util.book.js";
import { submitBookPrompt } from "./util.submit-prompt.js";
import { ChatCompletionMessageParam } from "openai/resources.js";
import { bookFieldPrompt } from "./prompt.book-field.js";

export async function generateBookField(book: Book, field: string, instructions: string): Promise<string> {
  const messages: ChatCompletionMessageParam[] = await bookFieldPrompt(book, field, instructions);
  const generatedField = await submitBookPrompt<string>(book, messages);
  const fieldPath = field.split(".");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let tmp: any = book;
  for (let i = 0; i < fieldPath.length; i++) {
    const segment = fieldPath[i];
    if (i === fieldPath.length - 1) {
      tmp[segment] = generatedField;
    } else {
      tmp = tmp[segment];
    }
  }
  await saveBook(book);
  return generatedField;
}
