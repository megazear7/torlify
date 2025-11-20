import z from "zod";
import { BookPartial } from "../shared/type.book";

export const UpdateBookImmediateEventName = z.literal("UpdateBookImmediate");
export type UpdateBookImmediateEventName = z.infer<
  typeof UpdateBookImmediateEventName
>;

export const UpdateBookImmediateEventDetail = BookPartial;
export type UpdateBookImmediateEventDetail = z.infer<
  typeof UpdateBookImmediateEventDetail
>;

export const UpdateBookImmediateEventData = z.object({
  name: UpdateBookImmediateEventName,
  detail: UpdateBookImmediateEventDetail,
});
export type UpdateBookImmediateEventData = z.infer<
  typeof UpdateBookImmediateEventData
>;

export const UpdateBookImmediateEvent = (
  detail: UpdateBookImmediateEventDetail,
): UpdateBookImmediateEventData => ({
  name: UpdateBookImmediateEventName.value,
  detail,
});
