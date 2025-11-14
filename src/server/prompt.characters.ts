import { ChatCompletionMessageParam } from "openai/resources";
import { Book } from "../shared/type.book.js";
import { MessageType } from "../shared/type.model.js";

export const charactersPrompt = async (
  book: Book,
): Promise<ChatCompletionMessageParam[]> => {
  return book.characters && book.characters.length > 0
    ? [
        {
          role: MessageType.enum.user,
          content: `
Characters in this book:

${book.characters
  .map((character) =>
    `
${character.name}: ${character.instructions}

Use this as simply background information. Do not reemphasize these character details in every part or chapter.
`.trim(),
  )
  .join("\n\n")}
`,
        },
      ]
    : [];
};
