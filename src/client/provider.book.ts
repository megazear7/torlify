import { provide } from "@lit/context";
import { property } from "lit/decorators.js";
import { BookContext, bookContext } from "./context.book.js";
import { LoadingStatus } from "../shared/type.loading.js";
import { parseRouteParams } from "../shared/util.route-params.js";
import "./component.book-editor.js";
import { getBookService } from "../shared/service.get-book.js";
import { TorlifyBookListProvider } from "./provider.book-list.js";
import { BookPartial } from "../shared/type.book.js";
import { updateBookService } from "../shared/service.update-book.js";
import {
  UpdateBookEventDetail,
  UpdateBookEventName,
} from "./event.update-book.js";
import { ONE_SECOND_IN_MS } from "../shared/util.time.js";
import { dispatch } from "./util.events.js";
import { SaveEvent } from "./event.save.js";
import {
  UpdateBookImmediateEventDetail,
  UpdateBookImmediateEventName,
} from "./event.update-book-immediate.js";

export abstract class TorlifyBookProvider extends TorlifyBookListProvider {
  @provide({ context: bookContext })
  @property({ attribute: false })
  bookContext: BookContext = {
    status: LoadingStatus.enum.idle,
  };

  private secondsBeforeAutoSaving = 5;
  private updateTimeoutId?: number;
  private updateRegistrationTime?: number;

  override async connectedCallback(): Promise<void> {
    super.connectedCallback();
    this.load();
    this.addEventListener(UpdateBookEventName.value, this.handleUpdateBook);
    this.addEventListener(
      UpdateBookImmediateEventName.value,
      this.handleUpdateBookImmediate,
    );
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.removeEventListener(UpdateBookEventName.value, this.handleUpdateBook);
    if (this.updateTimeoutId) {
      window.clearTimeout(this.updateTimeoutId);
    }
  }

  override async load(): Promise<void> {
    await super.load();
    const params = parseRouteParams(
      "/book/:bookId",
      window.location.pathname,
      true,
    );
    this.bookContext = {
      book: await getBookService.fetch({ bookId: params.bookId }),
      status: LoadingStatus.enum.success,
    };
  }

  private handleUpdateBook(event: Event): void {
    this.updateBookDebounce(
      UpdateBookEventDetail.parse((event as CustomEvent).detail),
    );
  }

  private handleUpdateBookImmediate(event: Event): void {
    this.updateBook(
      UpdateBookImmediateEventDetail.parse((event as CustomEvent).detail),
    );
  }

  private async updateBookDebounce(book: BookPartial): Promise<void> {
    // After 10 seconds, update the book even if the user is still typing.
    if (
      this.updateTimeoutId &&
      this.updateRegistrationTime &&
      Date.now() - this.updateRegistrationTime >
        ONE_SECOND_IN_MS * this.secondsBeforeAutoSaving
    ) {
      this.updateBook(book);
    }

    // If the user is typing, reset the timeout.
    if (this.updateTimeoutId) {
      window.clearTimeout(this.updateTimeoutId);
    }

    // After 1 second the book will be updated if ther user stops typing.
    if (!this.updateRegistrationTime) this.updateRegistrationTime = Date.now();
    this.updateTimeoutId = window.setTimeout(async () => {
      this.updateBook(book);
      this.updateTimeoutId = undefined;
    }, 1000) as number;
  }

  private async updateBook(book: BookPartial): Promise<void> {
    this.updateRegistrationTime = undefined;
    const updatedBook = await updateBookService.fetch({
      book,
      name: this.bookContext.book!.id,
    });
    this.bookContext = { ...this.bookContext, book: updatedBook };
    dispatch(this, SaveEvent());
  }
}
