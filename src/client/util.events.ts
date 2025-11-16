import z from "zod";
import { ModelSubmitEventData } from "./event.modal-submit.js";
import { NavigationEventData } from "./event.navigation.js";
import { WarningEventData } from "./event.warning.js";
import { SuccessEventData } from "./event.success.js";

export const TorlifyEvent = z.union([
  ModelSubmitEventData,
  NavigationEventData,
  WarningEventData,
  SuccessEventData,
]);
export type TorlifyEvent = z.infer<typeof TorlifyEvent>;

export const stopProp = (event: Event): void => {
  event.stopPropagation();
};

export const dispatch = (element: HTMLElement, event: TorlifyEvent): void => {
  element.dispatchEvent(
    new CustomEvent(event.name, {
      detail: event.detail,
      bubbles: true,
      composed: true,
    }),
  );
};
