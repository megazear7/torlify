import { ChatCompletionMessageParam } from "openai/resources";
import { MessageType } from "../shared/type.model.js";
import { GenerateBookParameters } from "../shared/service.generate-book.js";

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
