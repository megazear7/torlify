import { ChatCompletionMessageParam } from "openai/resources";
import { Chapter, ChapterPart } from "../shared/type.book.js";

export const makePartOutlinePrompt = async (
  chapter: Chapter,
  part: ChapterPart,
): Promise<ChatCompletionMessageParam[]> => [
  {
    role: "user",
    content: `
Existing chapter outline: ${chapter.outline.map((o, index) => `Part ${index + 1}: ${o || "No outline yet."}`).join("\n")}

Based on the existing chapter outline, create the outline part ${part.number} of the "${chapter.title}" chapter.
Keep in mind the details of when, where, what, why, how, and who from the chapter details but do not simply reiterate this information.
Each part of the outline should contain details as to the events that happen in that part, which characters are involved,
and details that an author would need to write it.
Do not include specific dates, months, and days in the overview.
Instead focus on what should be written in the book.
Do not include a "Part X:" prefix before each part.
Remember that you are an amazing author.
`.trim(),
  },
];
