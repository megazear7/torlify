import { ChatCompletionMessageParam } from "openai/resources";
import { Chapter, ChapterPartDescription } from "../shared/type.book.js";

export const fixQualityPrompt = async (
  chapter: Chapter,
  part: number,
  partDescription: ChapterPartDescription,
  currentText: string,
): Promise<ChatCompletionMessageParam[]> => {
  const lastPart = chapter.parts.length === part;
  return [
    {
      role: "user",
      content: `Part ${part} description: ${partDescription}`,
    },
    {
      role: "user",
      content: `Current text for part ${part}:\n${currentText}`,
    },
    {
      role: "user",
      content: `
Improve the writing quality of this part by enhancing grammar, style, clarity, and engagement.
Ensure the language is vivid, concise, and appropriate for the book's tone.
${lastPart ? "" : `The end of each part should flow to the beginning of the next part without a summary or conclusion.`}
Do not change the plot, characters, or core content.
Reply with the improved text only, without any additional comments or formatting.
The length of this part should remain about ${chapter.partLength} words long.
`.trim(),
    },
  ];
};
