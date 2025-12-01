import { BookOverview, LoadingMessages } from "../shared/type.book.js";
import { submitPrompt } from "./util.submit-prompt.js";

export async function generateLoadingMessages(
  book: BookOverview,
): Promise<LoadingMessages> {
  const messages: LoadingMessages = await submitPrompt<LoadingMessages>(
    [
      {
        role: "system",
        content:
          "You are a loading message generator for a book maker app that writes funny and engaging loading messages based on a provided book description. Each message should be 3-8 words long, be an action with a verb, and should not include commas.",
      },
      {
        role: "user",
        content: book,
      },
      {
        role: "user",
        content: "write 100 funny loading messages relevant to the content",
      },
    ],
    LoadingMessages,
  );
  return messages;
}
