import { Chapter, ChapterPartial } from "./type.book";

export function mergeChapterProperties(existingChapter: Chapter, newChapterData: ChapterPartial): Chapter {
  return {
    ...existingChapter,
    ...newChapterData,
  };
}
