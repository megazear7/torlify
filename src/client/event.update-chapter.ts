import z from "zod";
import { ChapterPartial } from "../shared/type.book";

export const UpdateChapterEventName = z.literal("UpdateChapter");
export type UpdateChapterEventName = z.infer<typeof UpdateChapterEventName>;

export const UpdateChapterEventDetail = ChapterPartial;
export type UpdateChapterEventDetail = z.infer<typeof UpdateChapterEventDetail>;

export const UpdateChapterEventData = z.object({
  name: UpdateChapterEventName,
  detail: UpdateChapterEventDetail,
});
export type UpdateChapterEventData = z.infer<typeof UpdateChapterEventData>;

export const UpdateChapterEvent = (
  detail: UpdateChapterEventDetail,
): UpdateChapterEventData => ({
  name: UpdateChapterEventName.value,
  detail,
});
