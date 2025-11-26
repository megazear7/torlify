import { provide } from "@lit/context";
import { property } from "lit/decorators.js";
import { LoadingStatus } from "../shared/type.loading.js";
import { parseRouteParams } from "../shared/util.route-params.js";
import { TorlifyChapterProvider } from "./provider.chapter.js";
import { PartContext, partContext } from "./context.book.js";
import {
  UpdatePartEventDetail,
  UpdatePartEventName,
} from "./event.update-part.js";
import { updatePartService } from "../shared/service.update-part.js";
import { ONE_SECOND_IN_MS } from "../shared/util.time.js";
import { SaveEvent } from "./event.save.js";
import { dispatch } from "./util.events.js";

export abstract class TorlifyPartProvider extends TorlifyChapterProvider {
  @provide({ context: partContext })
  @property({ attribute: false })
  partContext: PartContext = {
    status: LoadingStatus.enum.idle,
  };

  override async connectedCallback(): Promise<void> {
    await super.connectedCallback();
    await this.load();
    this.addEventListener(UpdatePartEventName.value, this.handleUpdatePart);
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.removeEventListener(UpdatePartEventName.value, this.handleUpdatePart);
  }

  override async load(): Promise<void> {
    await super.load();
    const params = parseRouteParams(
      "/book/:bookId/chapter/:chapterId/part/:partId",
      window.location.pathname,
      true,
    );
    this.partContext = {
      part:
        this.chapterContext.chapter?.parts[Number(params.partId) - 1] ||
        undefined,
      status: LoadingStatus.enum.success,
    };
  }

  handleUpdatePart(event: Event): void {
    this.updatePartDebounced(
      UpdatePartEventDetail.parse((event as CustomEvent).detail),
    );
  }

  updatePartDebounced(eventDetail: UpdatePartEventDetail): void {
    // After 10 seconds, update the book even if the user is still typing.
    if (
      this.updateTimeoutId &&
      this.updateRegistrationTime &&
      Date.now() - this.updateRegistrationTime >
        ONE_SECOND_IN_MS * this.secondsBeforeAutoSaving
    ) {
      this.updatePart(eventDetail);
    }

    // If the user is typing, reset the timeout.
    if (this.updateTimeoutId) {
      window.clearTimeout(this.updateTimeoutId);
    }

    // After 1 second the book will be updated if ther user stops typing.
    if (!this.updateRegistrationTime) this.updateRegistrationTime = Date.now();
    this.updateTimeoutId = window.setTimeout(async () => {
      this.updatePart(eventDetail);
      this.updateTimeoutId = undefined;
    }, ONE_SECOND_IN_MS) as number;
  }

  async updatePart(eventDetail: UpdatePartEventDetail): Promise<void> {
    this.updateRegistrationTime = undefined;
    const updatedPart = await updatePartService.fetch(eventDetail);
    this.partContext = { ...this.partContext, part: updatedPart };
    dispatch(this, SaveEvent());
  }
}
