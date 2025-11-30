import { ChatCompletionMessageParam } from "openai/resources";
import { Chapter } from "../shared/type.book.js";

export const makeChapterOutlinePrompt = async (
  chapter: Chapter,
): Promise<ChatCompletionMessageParam[]> => [
  {
    role: "user",
    content: `
Outline the "${chapter.title}" chapter into ${chapter.minParts} to ${chapter.maxParts} distinct parts.
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
