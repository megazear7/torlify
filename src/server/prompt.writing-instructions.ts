import { ChatCompletionMessageParam } from "openai/resources";
import { Book } from "../shared/type.book.js";
import { MessageType } from "../shared/type.model.js";

export const writingInstructionsPrompt = async (book: Book): Promise<ChatCompletionMessageParam[]> => {
  if (!book.instructions.writing) {
    return [];
  }
  return [
    {
      role: MessageType.enum.user,
      content: book.instructions.writing || "",
    },
  ];
};
