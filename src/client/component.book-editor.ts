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
import { downloadBookService } from "../shared/service.download-book.js";
import { TorlifyModal } from "./component.modal.js";
import { deleteBookService } from "../shared/service.delete-book.js";
import { NavigationEvent } from "./event.navigation.js";
import { generateChapterOutlineService } from "../shared/service.generate-chapter-outline.js";
import { generatePartService } from "../shared/service.generate-part.js";
import { AUTO_TEXTAREA_TAG_NAME } from "./component.auto-textarea.js";
import { mergeBookProperties } from "../shared/util.merge-book.js";
import "./component.auto-textarea.js";
import "./component.bar.js";

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

  @property({ type: Boolean })
  public loading: boolean = false;

  @property({ type: String })
  public loadingMessage: string = "Loading";

  @query("#remove-book-modal")
  private removeBookModal!: TorlifyModal;

  @query("#generate-remaining-modal")
  private generateRemainingModal!: TorlifyModal;

  @query("#configure-book-modal")
  private configureBookModal!: TorlifyModal;

  private debounceHandler = new DebounceHandler();

  override render(): TemplateResult {
    return html`
      ${this.bookContext.book
        ? html`
            <torlify-loading-overlay
              ?visible=${this.loading}
              message="${this.loadingMessage}"
            ></torlify-loading-overlay>
            <torlify-bar>
              <button @click=${this.downloadBook()} class="standard-button">
                Download
              </button>
              <button
                @click=${this.openConfigureBookModal}
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
                @click=${this.openGenerateRemainingModal}
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
            <torlify-modal id="configure-book-modal">
              <div slot="body">
                <h2>Configure Book</h2>
                <h3>Text Model Configuration</h3>
                <label for="model-text-name">Name</label>
                <input
                  type="text"
                  id="model-text-name"
                  .value="${this.bookContext.book.model.text.name}"
                  @input=${this.save("model.text.name")}
                />
                <label for="model-text-model-name">Model Name</label>
                <input
                  type="text"
                  id="model-text-model-name"
                  .value="${this.bookContext.book.model.text.modelName}"
                  @input=${this.save("model.text.modelName")}
                />
                <label for="model-text-endpoint">Endpoint</label>
                <input
                  type="text"
                  id="model-text-endpoint"
                  .value="${this.bookContext.book.model.text.endpoint}"
                  @input=${this.save("model.text.endpoint")}
                />
                <label for="model-text-cost-input">Input Token Cost</label>
                <input
                  type="text"
                  id="model-text-cost-input"
                  .value="${this.bookContext.book.model.text.cost
                    .inputTokenCost}"
                  @input=${this.save(
                    "model.text.cost.inputTokenCost",
                    "number",
                  )}
                />
                <label for="model-text-cost-output">Output Token Cost</label>
                <input
                  type="text"
                  id="model-text-cost-output"
                  .value="${this.bookContext.book.model.text.cost
                    .outputTokenCost}"
                  @input=${this.save(
                    "model.text.cost.outputTokenCost",
                    "number",
                  )}
                />
                <h3>Audio Model Configuration</h3>
                <label for="model-audio-name">Name</label>
                <input
                  type="text"
                  id="model-audio-name"
                  .value="${this.bookContext.book.model.audio.name}"
                  @input=${this.save("model.audio.name")}
                />
                <label for="model-audio-model-name">Model Name</label>
                <input
                  type="text"
                  id="model-audio-model-name"
                  .value="${this.bookContext.book.model.audio.modelName}"
                  @input=${this.save("model.audio.modelName")}
                />
                <label for="model-audio-endpoint">Endpoint</label>
                <input
                  type="text"
                  id="model-audio-endpoint"
                  .value="${this.bookContext.book.model.audio.endpoint}"
                  @input=${this.save("model.audio.endpoint")}
                />
                <label for="model-audio-cost-input">Input Token Cost</label>
                <input
                  type="text"
                  id="model-audio-cost-input"
                  .value="${this.bookContext.book.model.audio.cost
                    .inputTokenCost}"
                  @input=${this.save(
                    "model.audio.cost.inputTokenCost",
                    "number",
                  )}
                />
                <label for="model-audio-cost-output">Output Token Cost</label>
                <input
                  type="text"
                  id="model-audio-cost-output"
                  .value="${this.bookContext.book.model.audio.cost
                    .outputTokenCost}"
                  @input=${this.save(
                    "model.audio.cost.outputTokenCost",
                    "number",
                  )}
                />
              </div>
              <button class="standard-button" slot="submit-button">
                Close
              </button>
            </torlify-modal>
            <torlify-modal id="generate-remaining-modal">
              <div slot="body">
                <h3>Generate Remaining Content?</h3>
                <p>
                  Are you sure you want to generate the remaining content for
                  this book?
                </p>
                <p>It may take a long time.</p>
                <torlify-bar>
                  <button
                    class="standard-button"
                    @click="${this.confirmGenerateRemainingContent}"
                  >
                    Yes
                  </button>
                  <button
                    class="standard-button"
                    @click=${this.closeGenerateRemainingModal}
                  >
                    No
                  </button>
                </torlify-bar>
              </div>
            </torlify-modal>
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
                @input="${this.save("title")}"
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

  openConfigureBookModal = (): void => {
    this.configureBookModal.open();
  };

  openGenerateRemainingModal = (): void => {
    this.generateRemainingModal.open();
  };

  closeGenerateRemainingModal = (): void => {
    this.generateRemainingModal.close();
  };

  confirmGenerateRemainingContent = async (): Promise<void> => {
    this.generateRemainingModal.close();
    this.loading = true;
    this.loadingMessage = "Generating remaining content";
    try {
      for (let chapter of this.bookContext.book!.chapters) {
        this.loadingMessage = `Generating outline for chapter ${chapter.number}`;
        const generateOutline =
          chapter.outline.filter((item) => !item || !item.trim()).length > 0;
        if (generateOutline) {
          chapter = await generateChapterOutlineService.fetch({
            book: this.bookContext.book!.id,
            chapter: String(chapter.number),
          });
        }
        for (const part of chapter.parts) {
          if (!part.text || part.text.trim() === "") {
            this.loadingMessage = `Generating part ${part.number} of chapter ${chapter.number}`;
            await generatePartService.fetch({
              book: this.bookContext.book!.id,
              chapter: String(chapter.number),
              part: String(part.number),
            });
          }
        }
      }
      dispatch(
        this,
        NavigationEvent({ path: `/book/${this.bookContext.book!.id}` }),
      );
    } catch (error) {
      console.error("Error generating remaining content:", error);
      dispatch(this, WarningEvent("Failed to generate remaining content"));
    } finally {
      this.loading = false;
    }
  };

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

  save(
    prop: string,
    type: "text" | "number" = "text",
  ): (event: CustomEvent | InputEvent) => void {
    return (event: CustomEvent | InputEvent): void => {
      const isAutoTextarea =
        (event.target as HTMLElement).tagName.toLocaleLowerCase() ===
        AUTO_TEXTAREA_TAG_NAME;
      const value = isAutoTextarea
        ? (event as CustomEvent).detail.value
        : (event.target as HTMLInputElement).value;
      if (value === undefined) return;
      const finalValue = type === "number" ? Number(value) : value;
      const book = buildNestedObject(BookPartial, prop, finalValue);
      this.bookContext.book = mergeBookProperties(this.bookContext.book!, book);
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
