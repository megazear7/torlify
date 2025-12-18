import { ChatCompletionMessageParam } from "openai/resources";
import { Book } from "../shared/type.book.js";
import { MessageType } from "../shared/type.model.js";

export const bookOutlinePrompt = async (book: Book): Promise<ChatCompletionMessageParam[]> => [
  {
    role: MessageType.enum.user,
    content: book.chapters
      .map(
        (chapter, index) => `
Chapter ${index + 1}: ${chapter.title}

${chapter.outline.join("\n")}

`,
      )
      .join("\n"),
  },
];
