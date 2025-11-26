import z from "zod";
import {
  UpdatePartPathParameters,
  UpdatePartBodyParameters,
} from "../shared/service.update-part.js";

export const UpdatePartEventName = z.literal("UpdatePart");
export type UpdatePartEventName = z.infer<typeof UpdatePartEventName>;

export const UpdatePartEventDetail = UpdatePartPathParameters.extend(
  UpdatePartBodyParameters.shape,
);
export type UpdatePartEventDetail = z.infer<typeof UpdatePartEventDetail>;

export const UpdatePartEventData = z.object({
  name: UpdatePartEventName,
  detail: UpdatePartEventDetail,
});
export type UpdatePartEventData = z.infer<typeof UpdatePartEventData>;

export const UpdatePartEvent = (
  detail: UpdatePartEventDetail,
): UpdatePartEventData => ({
  name: UpdatePartEventName.value,
  detail,
});
