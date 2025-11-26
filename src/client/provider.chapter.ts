import { provide } from "@lit/context";
import { property } from "lit/decorators.js";
import { ChapterContext, chapterContext } from "./context.book.js";
import { LoadingStatus } from "../shared/type.loading.js";
import { parseRouteParams } from "../shared/util.route-params.js";
import { TorlifyBookProvider } from "./provider.book.js";
import {
  UpdateChapterEventName,
  UpdateChapterEventDetail,
} from "./event.update-chapter.js";
import { ChapterPartial } from "../shared/type.book.js";
import "./component.book-editor.js";
import { ONE_SECOND_IN_MS } from "../shared/util.time.js";
import { SaveEvent } from "./event.save.js";
import { dispatch } from "./util.events.js";
import { updateChapterService } from "../shared/service.update-chapter.js";

export abstract class TorlifyChapterProvider extends TorlifyBookProvider {
  @provide({ context: chapterContext })
  @property({ attribute: false })
  chapterContext: ChapterContext = {
    status: LoadingStatus.enum.idle,
  };

  override async connectedCallback(): Promise<void> {
    await super.connectedCallback();
    await this.load();
    this.addEventListener(
      UpdateChapterEventName.value,
      this.handleUpdateChapter,
    );
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.removeEventListener(
      UpdateChapterEventName.value,
      this.handleUpdateChapter,
    );
  }

  override async load(): Promise<void> {
    await super.load();
    const params = parseRouteParams(
      "/book/:bookId/chapter/:chapterId",
      window.location.pathname,
      true,
    );
    this.chapterContext = {
      chapter:
        this.bookContext.book?.chapters[Number(params.chapterId) - 1] ||
        undefined,
      status: LoadingStatus.enum.success,
    };
  }

  handleUpdateChapter(event: Event): void {
    this.updateChapterDebounced(
      UpdateChapterEventDetail.parse((event as CustomEvent).detail),
    );
  }

  updateChapterDebounced(chapter: ChapterPartial): void {
    // After 10 seconds, update the book even if the user is still typing.
    if (
      this.updateTimeoutId &&
      this.updateRegistrationTime &&
      Date.now() - this.updateRegistrationTime >
        ONE_SECOND_IN_MS * this.secondsBeforeAutoSaving
    ) {
      this.updateChapter(chapter);
    }

    // If the user is typing, reset the timeout.
    if (this.updateTimeoutId) {
      window.clearTimeout(this.updateTimeoutId);
    }

    // After 1 second the book will be updated if ther user stops typing.
    if (!this.updateRegistrationTime) this.updateRegistrationTime = Date.now();
    this.updateTimeoutId = window.setTimeout(async () => {
      this.updateChapter(chapter);
      this.updateTimeoutId = undefined;
    }, ONE_SECOND_IN_MS) as number;
  }

  async updateChapter(chapter: ChapterPartial): Promise<void> {
    if (!this.bookContext.book) {
      return;
    }

    this.updateRegistrationTime = undefined;
    const updatedChapter = await updateChapterService.fetch({
      book: this.bookContext.book.id,
      chapter,
    });
    this.chapterContext = { ...this.chapterContext, chapter: updatedChapter };
    dispatch(this, SaveEvent());
  }
}
