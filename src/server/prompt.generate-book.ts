import { ChatCompletionMessageParam } from "openai/resources";
import { MessageType } from "../shared/type.model.js";
import { GenerateBookParameters } from "../shared/service.generate-book.js";

export const generateBookPrompt = async (params: GenerateBookParameters): Promise<ChatCompletionMessageParam[]> => [
  {
    role: MessageType.enum.system,
    content: `
You are an expert book author.
Follow the user's instructions carefully to create a detailed book outline.
The book should have ${params.numberOfChapters} chapters.
When creating the outline, keep in mind the details of when, where, what, why, how, and who from the chapter details but do not simply reiterate this information.
Each part of the outline should contain details as to the events that happen in that part, which characters are involved, and details that an author would need to write it.
Do not include specific dates, months, and days in the overview. Instead focus on what should be written in the book.
Remember that you are an amazing author.
`.trim(),
  },
  {
    role: MessageType.enum.user,
    content: params.instructions,
  },
];
