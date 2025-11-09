import { ChatCompletionMessageParam } from "openai/resources";
import { Book } from "../shared/type.book.js";

export const bookOverviewPrompt = async (
  book: Book,
): Promise<ChatCompletionMessageParam[]> => [
  {
    role: "user",
    content: book.overview,
  },
  {
    role: "user",
    content: `The above is an overview of the book that you will be writing.`,
  },
];
