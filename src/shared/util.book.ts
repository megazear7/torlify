import { Book, Chapter, ChapterPart } from "./type.book.js";

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

export function createOutlineForBook(book: Book): string {
  const outlines: string[] = [];
  outlines.push(`# ${book.title}`);
  outlines.push("");
  for (const chapter of book.chapters || []) {
    outlines.push(createOutlineForChapter(chapter));
    outlines.push("");
  }
  return outlines.join("\n");
}

export function createOutlineForChapter(chapter: Chapter): string {
  const outlines: string[] = [];
  outlines.push(`## Chapter ${chapter.number}: ${chapter.title}`);
  outlines.push("");
  for (const part of chapter.parts) {
    outlines.push(createOutlineForPart(chapter, part));
  }
  if (chapter.outline.length === 0) {
    outlines.push("(No chapter outline available)");
    outlines.push("");
  }
  return outlines.join("\n");
}

export function createOutlineForPart(chapter: Chapter, part: ChapterPart): string {
  const outlines: string[] = [];
  const partDescription = chapter.outline[part.number - 1];
  outlines.push(`### Part ${part.number}`);
  outlines.push("");
  outlines.push(partDescription || "(No part description)");
  outlines.push("");
  return outlines.join("\n");
}
