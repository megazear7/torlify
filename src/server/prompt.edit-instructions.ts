import { ChatCompletionMessageParam } from "openai/resources";
import { Book } from "../shared/type.book";

export const editInstructionsPrompt = async (
  book: Book,
): Promise<ChatCompletionMessageParam[]> => [
  {
    role: "user",
    content: book.instructions.edit,
  },
];
