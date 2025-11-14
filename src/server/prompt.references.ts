import { ChatCompletionMessageParam } from "openai/resources";
import { Book, ReferenceUse } from "../shared/type.book.js";
import { loadFiles } from "./util.file.js";
import { MessageType } from "../shared/type.model.js";

export const referencesPrompt = async (
  book: Book,
  use: ReferenceUse,
): Promise<ChatCompletionMessageParam[]> => {
  const loadedRefs: ChatCompletionMessageParam[] = [];
  for (const ref of book.references) {
    if (ref.whenToUse.includes(use)) {
      const loadedRef = await loadFiles(ref);
      loadedRefs.push({
        role: MessageType.enum.user,
        content: loadedRef.fileContent,
      });
      loadedRefs.push({
        role: MessageType.enum.user,
        content: loadedRef.instructions,
      });
    }
  }

  return loadedRefs;
};
