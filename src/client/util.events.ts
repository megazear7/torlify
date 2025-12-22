import z from "zod";
import { ModelSubmitEventData } from "./event.modal-submit.js";
import { NavigationEventData } from "./event.navigation.js";
import { ScrollToEventData } from "./event.scroll-to.js";
import { WarningEventData } from "./event.warning.js";
import { SuccessEventData } from "./event.success.js";
import { SaveEventData } from "./event.save.js";
import { ModelClosingEventData } from "./event.modal-closing.js";
import { ModelOpeningEventData } from "./event.modal-opening.js";
import { PronunciationUpdatedEventData } from "./event.pronunciation-updated.js";

export const InklifyEvent = z.union([
  ModelSubmitEventData,
  ModelOpeningEventData,
  ModelClosingEventData,
  NavigationEventData,
  ScrollToEventData,
  WarningEventData,
  SuccessEventData,
  SaveEventData,
  PronunciationUpdatedEventData,
]);
export type InklifyEvent = z.infer<typeof InklifyEvent>;

export const stopProp = (event: Event): void => {
  event.stopPropagation();
};

export const dispatch = (element: HTMLElement, event: InklifyEvent): void => {
  element.dispatchEvent(
    new CustomEvent(event.name, {
      detail: event.detail,
      bubbles: true,
      composed: true,
    }),
  );
};
