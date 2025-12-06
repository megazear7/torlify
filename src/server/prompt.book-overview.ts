import { ChatCompletionMessageParam } from "openai/resources";
import { Book } from "../shared/type.book.js";
import { MessageType } from "../shared/type.model.js";

export const bookOverviewPrompt = async (book: Book): Promise<ChatCompletionMessageParam[]> => [
  {
    role: MessageType.enum.user,
    content: book.overview,
  },
  {
    role: MessageType.enum.user,
    content: `The above is an overview of the book that you will be writing.`,
  },
];
