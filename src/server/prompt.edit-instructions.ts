import { ChatCompletionMessageParam } from "openai/resources";
import { Book } from "../shared/type.book";
import { MessageType } from "../shared/type.model";

export const editInstructionsPrompt = async (
  book: Book,
): Promise<ChatCompletionMessageParam[]> => [
  {
    role: MessageType.enum.user,
    content: book.instructions.edit || "",
  },
];
