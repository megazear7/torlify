import { ChatCompletionMessageParam } from "openai/resources";
import { Chapter } from "../shared/type.book.js";

export const chapterDetailsPrompt = async (chapter: Chapter): Promise<ChatCompletionMessageParam[]> => [
  {
    role: "user",
    content: `
Chapter ${chapter.number}: ${chapter.title}

When:
${chapter.when}

Where
${chapter.where}

What
${chapter.what}

Why
${chapter.why}

How
${chapter.how}

Who
${chapter.who}
`.trim(),
  },
];
