import { ChatCompletionMessageParam } from "openai/resources";

export const generateBookPrompt = async (): Promise<
  ChatCompletionMessageParam[]
> => [
  {
    role: "user",
    content: `
You are an author and you are going to create a book outline.
`,
  },
];
