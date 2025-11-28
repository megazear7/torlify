import { consume } from "@lit/context";
import { css, html, LitElement, TemplateResult } from "lit";
import { customElement, property, query } from "lit/decorators.js";
import { BookContext, bookContext } from "./context.book.js";
import { LoadingStatus } from "../shared/type.loading.js";
import { globalStyles } from "./styles.global.js";
import { formatNumber } from "../shared/util.number.js";
import { dispatch } from "./util.events.js";
import { buildNestedObject } from "../shared/util.property.js";
import { BookPartial } from "../shared/type.book.js";
import { WarningEvent } from "./event.warning.js";
import { SaveEvent } from "./event.save.js";
import { DebounceHandler } from "./util.debounce.js";
import { updateBookService } from "../shared/service.update-book.js";
import "./component.auto-textarea.js";
import "./component.bar.js";
import { downloadBookService } from "../shared/service.download-book.js";
import { TorlifyModal } from "./component.modal.js";
import { deleteBookService } from "../shared/service.delete-book.js";
import { NavigationEvent } from "./event.navigation.js";

@customElement("torlify-book-editor")
export class TorlifyBookEditor extends LitElement {
  static override styles = [
    globalStyles,
    css`
      .stats {
        display: flex;
        gap: var(--size-large);
        margin-top: var(--size-medium);
        font-size: var(--font-small);
        color: var(--color-secondary-text);
      }
    `,
  ];

  @consume({ context: bookContext, subscribe: true })
  @property({ attribute: false })
  public bookContext: BookContext = {
    status: LoadingStatus.enum.idle,
  };

  @query("#remove-book-modal")
  private removeBookModal!: TorlifyModal;

  private debounceHandler = new DebounceHandler();

  override render(): TemplateResult {
    return html`
      ${this.bookContext.book
        ? html`
            <torlify-bar>
              <button @click=${this.downloadBook()} class="standard-button">
                Download
              </button>
              <button
                @click=${(): void =>
                  dispatch(this, WarningEvent("Not implemented"))}
                class="standard-button"
              >
                Configure
              </button>
              <button
                @click=${(): void =>
                  dispatch(this, WarningEvent("Not implemented"))}
                class="standard-button"
              >
                Details
              </button>
              <button
                @click=${(): void =>
                  dispatch(this, WarningEvent("Not implemented"))}
                class="standard-button"
              >
                Generate
              </button>
              <button
                class="standard-button"
                @click=${this.openRemoveBookModal}
              >
                Remove
              </button>
            </torlify-bar>
            <torlify-modal id="remove-book-modal">
              <div slot="body">
                <h3>Remove Book</h3>
                <p>Are you sure you want to remove this book?</p>
                <torlify-bar>
                  <button
                    class="standard-button"
                    @click="${this.confirmRemoveBook}"
                  >
                    Yes
                  </button>
                  <button
                    class="standard-button"
                    @click=${this.closeRemoveBookModal}
                  >
                    No
                  </button>
                </torlify-bar>
              </div>
            </torlify-modal>
            <div class="secondary-surface">
              <torlify-auto-textarea
                cssClass="h2"
                .value="${this.bookContext.book.title}"
                @input="${(e: CustomEvent): void =>
                  (this.bookContext.book!.title = e.detail.value)}"
              ></torlify-auto-textarea>
              <div class="stats">
                <span>${formatNumber(this.tokens)} tokens</span>
                <span>$${formatNumber(this.cost, { decimals: 2 })}</span>
                <span>${formatNumber(this.words)} words</span>
              </div>
            </div>
            <div class="secondary-surface">
              <h4>Overview</h4>
              <torlify-auto-textarea
                .value="${this.bookContext.book.overview}"
                @input="${this.save("overview")}"
              ></torlify-auto-textarea>
              <h4>Edit Instructions</h4>
              <torlify-auto-textarea
                .value="${this.bookContext.book.instructions.edit}"
                @input="${this.save("instructions.edit")}"
              ></torlify-auto-textarea>
              <h4>Audio Instructions</h4>
              <torlify-auto-textarea
                .value="${this.bookContext.book.instructions.audio}"
                @input="${this.save("instructions.audio")}"
              ></torlify-auto-textarea>
            </div>
          `
        : html`<p>Loading book...</p>`}
    `;
  }

  downloadBook(): () => void {
    return async (): Promise<void> => {
      await downloadBookService.fetch({ book: this.bookContext.book!.id });
    };
  }

  openRemoveBookModal = (): void => {
    this.removeBookModal.open();
  };

  confirmRemoveBook = async (): Promise<void> => {
    const bookId = this.bookContext.book!.id;
    try {
      await deleteBookService.fetch({ bookId });
      dispatch(this, WarningEvent("Book deleted successfully"));
    } catch {
      dispatch(this, WarningEvent("Book deletion failed"));
    } finally {
      this.removeBookModal.close();
      dispatch(this, NavigationEvent({ path: "/" }));
    }
  };

  closeRemoveBookModal = (): void => {
    this.removeBookModal.close();
  };

  save(prop: string): (event: CustomEvent) => void {
    return (event: CustomEvent): void => {
      if (event.detail.value === undefined) return;
      const book = buildNestedObject(BookPartial, prop, event.detail.value);
      this.bookContext.book = {
        ...this.bookContext.book!,
        ...book,
      };
      this.debounceHandler.debounce(() => {
        updateBookService.fetch({
          book,
          name: this.bookContext.book!.id,
        });
        dispatch(this, SaveEvent());
      });
    };
  }

  get tokens(): number {
    const tokenCounts = [
      this.bookContext.book?.model.text.usage.completion_tokens || 0,
      this.bookContext.book?.model.text.usage.prompt_tokens || 0,
      this.bookContext.book?.model.audio.usage.completion_tokens || 0,
      this.bookContext.book?.model.audio.usage.prompt_tokens || 0,
    ];
    return tokenCounts.reduce((acc, curr) => acc + curr, 0);
  }

  get cost(): number {
    const oneMillionth = 1 / 1000000;
    const textCompletionCost =
      (this.bookContext.book?.model.text.usage.completion_tokens || 0) *
      (this.bookContext.book?.model.text.cost.outputTokenCost || 0) *
      oneMillionth;
    const textPromptCost =
      (this.bookContext.book?.model.text.usage.prompt_tokens || 0) *
      (this.bookContext.book?.model.text.cost.inputTokenCost || 0) *
      oneMillionth;
    const audioCompletionCost =
      (this.bookContext.book?.model.audio.usage.completion_tokens || 0) *
      (this.bookContext.book?.model.audio.cost.outputTokenCost || 0) *
      oneMillionth;
    const audioPromptCost =
      (this.bookContext.book?.model.audio.usage.prompt_tokens || 0) *
      (this.bookContext.book?.model.audio.cost.inputTokenCost || 0) *
      oneMillionth;

    return (
      textCompletionCost +
      textPromptCost +
      audioCompletionCost +
      audioPromptCost
    );
  }

  get words(): number {
    return (
      this.bookContext.book?.chapters.reduce((acc, chapter) => {
        const partWords = chapter.parts.reduce((partAcc, part) => {
          const wordsInPart = part.text
            ? part.text.trim().split(/\s+/).length
            : 0;
          return partAcc + wordsInPart;
        }, 0);
        return acc + partWords;
      }, 0) || 0
    );
  }
}
