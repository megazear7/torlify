import z from "zod";
import { BookPartial } from "../shared/type.book";

export const UpdateBookEventName = z.literal("UpdateBook");
export type UpdateBookEventName = z.infer<typeof UpdateBookEventName>;

export const UpdateBookEventDetail = BookPartial;
export type UpdateBookEventDetail = z.infer<typeof UpdateBookEventDetail>;

export const UpdateBookEventData = z.object({
  name: UpdateBookEventName,
  detail: UpdateBookEventDetail,
});
export type UpdateBookEventData = z.infer<typeof UpdateBookEventData>;

export const UpdateBookEvent = (
  detail: UpdateBookEventDetail,
): UpdateBookEventData => ({
  name: UpdateBookEventName.value,
  detail,
});
