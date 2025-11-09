import { ChatCompletionMessageParam } from "openai/resources";

export const generateBookPrompt = async (): Promise<
  ChatCompletionMessageParam[]
> => [
  {
    role: "user",
    content: `
You are a book config creator and you create a book outline.

The model text should be grok and the model audio should be gpt.
There should be 4-6 chapters.
Each reference should include multiple paragraphs of sample writing to esablish a writing tone and style.
The book id should be less than 12 characters.
The tokens and dollars in the usage section must be 0.
The references should be an empty array.
The part length should be 600, 800, or 1000.
The chapter outline and part attributes should be empty arrays.

The users next prompt will include a description of the book outline that needs written.
`,
  },
];
