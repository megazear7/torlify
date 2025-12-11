import { Book, Chapter } from "./type.book.js";

export function countWords(book: Book): number {
  return book.chapters.reduce((total: number, chapter: Chapter) => {
    const chapterWordCount = chapter.parts.reduce((partTotal, part) => {
      return partTotal + part.text.split(/\s+/).filter((word) => word.length > 0).length;
    }, 0);
    return total + chapterWordCount;
  }, 0);
}

export function countTokens(book: Book): number {
  const tokenCounts = [
    book.model.text.usage.completion_tokens || 0,
    book.model.text.usage.prompt_tokens || 0,
    book.model.audio.usage.completion_tokens || 0,
    book.model.audio.usage.prompt_tokens || 0,
  ];
  return tokenCounts.reduce((acc, curr) => acc + curr, 0);
}

export function cost(book: Book): number {
  const oneMillionth = 1 / 1000000;
  const textCompletionCost =
    (book.model.text.usage.completion_tokens || 0) * (book.model.text.cost.outputTokenCost || 0) * oneMillionth;
  const textPromptCost =
    (book.model.text.usage.prompt_tokens || 0) * (book.model.text.cost.inputTokenCost || 0) * oneMillionth;
  const audioCompletionCost =
    (book.model.audio.usage.completion_tokens || 0) * (book.model.audio.cost.outputTokenCost || 0) * oneMillionth;
  const audioPromptCost =
    (book.model.audio.usage.prompt_tokens || 0) * (book.model.audio.cost.inputTokenCost || 0) * oneMillionth;

  return textCompletionCost + textPromptCost + audioCompletionCost + audioPromptCost;
}
