import { ChatCompletionMessageParam } from "openai/resources";
import { Chapter, ChapterPartNumber } from "../shared/type.book.js";
import { MessageType } from "../shared/type.model.js";

export const priorPartsPrompt = async (
  chapter: Chapter,
  partNumber: ChapterPartNumber,
): Promise<ChatCompletionMessageParam[]> => {
  const priorParts = chapter.parts.slice(0, partNumber - 1);
  return priorParts.length > 0
    ? [
        {
          role: MessageType.enum.user,
          content: `
Chapter ${chapter.number} ${priorParts.length > 1 ? `parts ${1} through ${priorParts.length + 1}` : `part 1:`}:

${priorParts.map((part) => part.text).join("\n")}
`,
        },
      ]
    : [];
};
