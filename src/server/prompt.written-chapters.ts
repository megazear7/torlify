import { ChatCompletionMessageParam } from "openai/resources";
import { Book, Chapter } from "../shared/type.book.js";
import { MessageType } from "../shared/type.model.js";

export const writtenChaptersPrompt = async (
  book: Book,
  chapterBeingWritten: Chapter,
): Promise<ChatCompletionMessageParam[]> => {
  const priorChapters = book.chapters.slice(0, chapterBeingWritten.number - 1);
  return priorChapters
    .filter(
      (chapter) =>
        chapter.parts.length > 0 &&
        chapter.number != chapterBeingWritten.number,
    )
    .map((chapter) => ({
      role: MessageType.enum.user,
      content: `
Chapter ${chapter.number}: ${chapter.title}

${chapter.parts.map((part) => part.text).join("\n")}
`,
    }));
};
