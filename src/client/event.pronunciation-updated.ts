import z from "zod";

export const PronunciationUpdatedEventName = z.literal("PronunciationUpdated");
export type PronunciationUpdatedEventName = z.infer<typeof PronunciationUpdatedEventName>;

export const PronunciationUpdatedEventDetail = z.object({
  field: z.enum(["match", "replace"]),
  value: z.string(),
});
export type PronunciationUpdatedEventDetail = z.infer<typeof PronunciationUpdatedEventDetail>;

export const PronunciationUpdatedEventData = z.object({
  name: PronunciationUpdatedEventName,
  detail: PronunciationUpdatedEventDetail,
});
export type PronunciationUpdatedEventData = z.infer<typeof PronunciationUpdatedEventData>;

export const PronunciationUpdatedEvent = (detail: PronunciationUpdatedEventDetail): PronunciationUpdatedEventData => ({
  name: PronunciationUpdatedEventName.value,
  detail,
});
