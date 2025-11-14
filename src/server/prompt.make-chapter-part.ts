import { ChatCompletionMessageParam } from "openai/resources";
import { Chapter, ChapterPartDescription } from "../shared/type.book.js";
import { MessageType } from "../shared/type.model.js";

export const makeChapterPartPrompt = async (
  chapter: Chapter,
  part: number,
  partDescription: ChapterPartDescription,
): Promise<ChatCompletionMessageParam[]> => {
  let partsAndChapters = "";
  if (chapter.number === 1 && part > 1) {
    partsAndChapters = "parts";
  } else if (chapter.number > 1 && part === 1) {
    partsAndChapters = "chapters";
  } else if (chapter.number > 1 && part > 1) {
    partsAndChapters = "parts and chapters";
  }

  const referenceMsg =
    chapter.number > 1 || part > 1
      ? `Refer to previous ${partsAndChapters} and do NOT continually emphasize the same character developments, motivations, and themes.\n`
      : "";

  return [
    {
      role: MessageType.enum.user,
      content: `Part ${part} description: ${partDescription}`,
    },
    {
      role: MessageType.enum.user,
      content: `
Write part ${part} of chapter ${chapter.number} based on the above description${part > 1 ? " and the existing parts that were provided previously. The text should be a continuous flow from the prevous part." : ""}.
${referenceMsg}Do not include the chapter or part title at the beginning or any other information.
Only provide the written text of this part of the book.
Do not use dashes or em dashes such as - and —.
Reply in plain text without formatting.
The length of this part should be about ${chapter.partLength} words long.
You are an incredible author writing the next part of an amazing book.
Do not summarize the characters thoughts or feeling at the end.
`.trim(),
    },
  ];
};
