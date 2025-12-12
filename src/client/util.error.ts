import { WarningEvent } from "./event.warning.js";
import { dispatch } from "./util.events";

export function handleError(element: HTMLElement, error: unknown, message: string): void {
  const info = error instanceof Error ? error.message : String(error);
  dispatch(element, WarningEvent(message, info));
}
