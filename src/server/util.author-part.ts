import { ChatCompletionMessageParam } from "openai/resources";
import {
  Book,
  BookChapterPartText,
  Chapter,
  ChapterPart,
  ChapterPartDescription,
  ChapterPartNumber,
  ReferenceUse,
} from "../shared/type.book.js";
import { charactersPrompt } from "./prompt.characters.js";
import { referencesPrompt } from "./prompt.references.js";
import { editInstructionsPrompt } from "./prompt.edit-instructions.js";
import { writtenChaptersPrompt } from "./prompt.written-chapters.js";
import { priorPartsPrompt } from "./prompt.prior-parts.js";
import { makeChapterPartPrompt } from "./prompt.make-chapter-part.js";
import { submitBookPrompt } from "./util.submit-prompt.js";

export const authorPart = async (
  book: Book,
  chapter: Chapter,
  partNumber: ChapterPartNumber,
): Promise<ChapterPart> => {
  const partDescription: ChapterPartDescription =
    chapter.outline[partNumber - 1];

  const messages: ChatCompletionMessageParam[] = [
    ...(await charactersPrompt(book)),
    ...(await referencesPrompt(book, ReferenceUse.enum.writing)),
    ...(await editInstructionsPrompt(book)),
    ...(await writtenChaptersPrompt(book, chapter)),
    ...(await priorPartsPrompt(chapter, partNumber)),
    ...(await makeChapterPartPrompt(chapter, partNumber, partDescription)),
  ];

  const part: BookChapterPartText = await submitBookPrompt(
    book,
    messages,
    BookChapterPartText,
  );
  throw new Error("Not implemented yet: " + JSON.stringify(part));
};
