import { TorlifyEvent } from "../shared/type.events.js";

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
}
