import z from "zod";
import { ModelSubmitEventData } from "./event.modal-submit.js";
import { NavigationEventData } from "./event.navigation.js";
import { ScrollToEventData } from "./event.scroll-to.js";
import { WarningEventData } from "./event.warning.js";
import { SuccessEventData } from "./event.success.js";
import { UpdateBookEventData } from "./event.update-book.js";
import { SaveEventData } from "./event.save.js";
import { UpdateBookImmediateEventData } from "./event.update-book-immediate.js";
import { UpdateChapterEventData } from "./event.update-chapter.js";
import { ModelClosingEventData } from "./event.modal-closing.js";
import { ModelOpeningEventData } from "./event.modal-opening.js";
import { UpdatePartEventData } from "./event.update-part.js";

export const TorlifyEvent = z.union([
  ModelSubmitEventData,
  ModelOpeningEventData,
  ModelClosingEventData,
  NavigationEventData,
  ScrollToEventData,
  WarningEventData,
  SuccessEventData,
  UpdateBookEventData,
  UpdateBookImmediateEventData,
  UpdateChapterEventData,
  UpdatePartEventData,
  SaveEventData,
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
