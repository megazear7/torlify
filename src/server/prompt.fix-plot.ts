import { ChatCompletionMessageParam } from "openai/resources";
import { Chapter, ChapterPartDescription } from "../shared/type.book.js";

export const fixPlotPrompt = async (
  chapter: Chapter,
  part: number,
  partDescription: ChapterPartDescription,
  currentText: string,
): Promise<ChatCompletionMessageParam[]> => {
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
Fix any plot inconsistencies, logical errors, or continuity issues in this part based on the previous parts, chapters, and the overall book.
Ensure the story progresses logically and maintains coherence with the established plot.
Do not change the core content or add new elements unless necessary to fix inconsistencies.
Reply with the improved text only, without any additional comments or formatting.
The length of this part should remain about ${chapter.partLength} words long.
`.trim(),
    },
  ];
};
