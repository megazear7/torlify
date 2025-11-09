import { ChatCompletionMessageParam } from "openai/resources";
import { Book, ReferenceUse } from "../shared/type.book.js";
import { loadFiles } from "../server/util.file.js";

export const referencesPrompt = async (
  book: Book,
  use: ReferenceUse,
): Promise<ChatCompletionMessageParam[]> => {
  const loadedRefs: ChatCompletionMessageParam[] = [];
  for (const ref of book.references) {
    if (ref.whenToUse.includes(use)) {
      const loadedRef = await loadFiles(ref);
      loadedRefs.push({
        role: "user",
        content: loadedRef.fileContent,
      });
      loadedRefs.push({
        role: "user",
        content: loadedRef.instructions,
      });
    }
  }

  return loadedRefs;
};
