import { ChatCompletionMessageParam } from "openai/resources";
import { GenerateBookParameters } from "../shared/type.request.generate-book.js";
import { MessageType } from "../shared/type.model.js";

export const generateBookPrompt = async (
  params: GenerateBookParameters,
): Promise<ChatCompletionMessageParam[]> => [
  {
    role: MessageType.enum.system,
    content: `You are an expert book author. Follow the user's instructions carefully to create a detailed book outline.`,
  },
  {
    role: MessageType.enum.user,
    content: params.instructions,
  },
];
