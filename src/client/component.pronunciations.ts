import { consume } from "@lit/context";
import { css, html, LitElement, TemplateResult } from "lit";
import { customElement, property } from "lit/decorators.js";
import { BookContext, bookContext } from "./context.js";
import { LoadingStatus } from "../shared/type.loading.js";
import { globalStyles } from "./styles.global.js";
import { dispatch } from "./util.events.js";
import { plusIcon, trashIcon } from "./icons.js";
import { wait } from "../shared/util.wait.js";
import { updateBookService } from "../shared/service.update-book.js";
import { SaveEvent } from "./event.save.js";
import { DebounceHandler } from "./util.debounce.js";
import "./component.configure-pronunciation.js";
import { PronunciationUpdatedEventDetail } from "./event.pronunciation-updated.js";

@customElement("torlify-pronunciations")
export class TorlifyPronunciations extends LitElement {
  static override styles = [
    globalStyles,
    css`
      .pronunciations-container {
        margin-top: var(--size-xl);
      }

      .pronunciations-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: var(--size-medium);
      }

      .add-button {
        background: var(--color-secondary-surface);
        color: var(--color-secondary-text);
        border: none;
        border-radius: var(--radius-medium);
        padding: var(--size-small) var(--size-medium);
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: var(--size-small);
        font-size: var(--font-small);
        transition: var(--transition-all);
      }

      .add-button:hover {
        background: var(--color-2);
        transform: var(--transform-hover);
      }

      .pronunciations-list {
        display: flex;
        flex-direction: column;
        gap: var(--size-large);
      }

      .pronunciation-item {
        background: var(--color-secondary-surface);
        border-radius: var(--radius-medium);
        padding: var(--size-medium);
        padding-top: calc(var(--size-xl) + 4px);
        display: flex;
        align-items: center;
        gap: var(--size-medium);
        animation: slideIn 0.3s ease-out;
        border: 1px solid transparent;
        transition: var(--transition-all);
        box-shadow: var(--shadow-normal);
      }

      .pronunciation-item:hover {
        box-shadow: var(--shadow-hover);
      }

      .pronunciation-item.removing {
        animation: slideOut 0.3s ease-in forwards;
      }

      .pronunciation-inputs {
        flex: 1;
        display: flex;
        gap: var(--size-large);
      }

      .pronunciation-field {
        position: relative;
        flex: 1;
      }

      .pronunciation-label {
        position: absolute;
        top: calc((-1 * var(--size-large)) - 4px);
        font-size: var(--font-tiny);
        font-weight: 500;
        text-transform: uppercase;
        color: var(--color-secondary-text-muted);
      }

      .pronunciation-input {
        border: 1px solid var(--color-grey-transparent);
        border-radius: var(--radius-medium);
        margin: 0 !important;
        background: transparent;
        padding: var(--size-medium) var(--size-large);
        color: var(--color-primary-text);
        font-size: var(--font-medium);
        transition: var(--transition-all);
      }

      .pronunciation-input:focus {
        outline: none;
        border-color: var(--color-1);
        box-shadow: var(--shadow-active);
        background: var(--color-secondary-surface-active);
      }

      .pronunciation-input::placeholder {
        color: var(--color-secondary-text);
        opacity: 0.7;
      }

      .remove-button {
        background: none;
        border: none;
        color: var(--color-primary-text);
        cursor: pointer;
        padding: var(--size-small);
        border-radius: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: var(--transition-all);
        opacity: 0.7;
      }

      .remove-button:hover {
        background: var(--color-error);
        color: white;
        opacity: 1;
        transform: scale(1.1);
      }

      .empty-state {
        text-align: center;
        color: var(--color-secondary-text);
        font-style: italic;
        padding: var(--size-xl);
        background: var(--color-secondary-surface);
        border-radius: var(--radius-medium);
        border: 2px dashed var(--color-border);
      }

      @keyframes slideIn {
        from {
          opacity: 0;
          transform: translateY(-10px) scale(0.95);
        }
        to {
          opacity: 1;
          transform: translateY(0) scale(1);
        }
      }

      @keyframes slideOut {
        from {
          opacity: 1;
          transform: translateY(0) scale(1);
          max-height: 100px;
        }
        to {
          opacity: 0;
          transform: translateY(-10px) scale(0.95);
          max-height: 0;
          margin: 0;
          padding: 0;
        }
      }
    `,
  ];

  @consume({ context: bookContext, subscribe: true })
  @property({ attribute: false })
  public bookContext: BookContext = {
    status: LoadingStatus.enum.idle,
  };

  @property({ type: Array })
  private removingIndices: number[] = [];

  private debounceHandler = new DebounceHandler();

  override render(): TemplateResult {
    const pronunciations = this.bookContext.book?.pronunciation || [];

    return html`
      <div class="pronunciations-container">
        <div class="pronunciations-header">
          <h4>Pronunciations</h4>
          <button class="add-button" @click="${this.addPronunciation}">${plusIcon} Add Pronunciation</button>
        </div>

        ${pronunciations.length === 0
          ? html`
              <div class="empty-state">No pronunciations added yet started.</div>
            `
          : html`
              <div class="pronunciations-list">
                ${pronunciations.map(
                  (pronunciation, index) => html`
                    <div class="pronunciation-item ${this.removingIndices.includes(index) ? "removing" : ""}">
                      <div class="pronunciation-field">
                        <label class="pronunciation-label">Match Text</label>
                        <input
                          class="pronunciation-input"
                          type="text"
                          placeholder="Word or phrase to replace"
                          .value="${pronunciation.match}"
                          @input="${(e: Event): void =>
                            this.updatePronunciation(index, "match", (e.target as HTMLInputElement).value)}" />
                      </div>
                      <div class="pronunciation-field">
                        <label class="pronunciation-label">Replace With</label>
                        <input
                          class="pronunciation-input"
                          type="text"
                          placeholder="Pronunciation replacement"
                          .value="${pronunciation.replace}"
                          @input="${(e: Event): void =>
                            this.updatePronunciation(index, "replace", (e.target as HTMLInputElement).value)}" />
                      </div>
                      <torlify-configure-pronunciation
                        .pronunciation="${pronunciation}"
                        @PronunciationUpdated=${this.handlePronunciationMatch(index)}></torlify-configure-pronunciation>
                      <button
                        class="remove-button"
                        @click="${async (): Promise<void> => this.removePronunciation(index)}"
                        title="Remove pronunciation">
                        ${trashIcon}
                      </button>
                    </div>
                  `,
                )}
              </div>
            `}
      </div>
    `;
  }

  private handlePronunciationMatch(index: number): (e: CustomEvent) => void {
    return (e: CustomEvent): void => {
      console.log("B");
      const detail = PronunciationUpdatedEventDetail.parse(e.detail);
      this.updatePronunciation(index, detail.field, detail.value);
    };
  }

  private addPronunciation(): void {
    const currentPronunciations = this.bookContext.book?.pronunciation || [];
    const newPronunciations = [...currentPronunciations, { match: "", replace: "" }];
    this.bookContext.book!.pronunciation = newPronunciations;
    this.requestUpdate();
    this.debounceHandler.debounce(() => {
      updateBookService.fetch({
        name: this.bookContext.book!.id,
        book: this.bookContext.book!,
      });
      dispatch(this, SaveEvent());
    });
  }

  private async removePronunciation(index: number): Promise<void> {
    this.removingIndices = [...this.removingIndices, index];
    this.requestUpdate();
    await wait(350);
    this.removingIndices = this.removingIndices.filter((i) => i !== index);
    const currentPronunciations = this.bookContext.book?.pronunciation || [];
    const newPronunciations = currentPronunciations.filter((_, i) => i !== index);
    this.bookContext.book = {
      ...this.bookContext.book!,
      pronunciation: newPronunciations,
    };
    this.debounceHandler.debounce(() => {
      updateBookService.fetch({
        name: this.bookContext.book!.id,
        book: this.bookContext.book!,
      });
      dispatch(this, SaveEvent());
    });
  }

  private updatePronunciation(index: number, field: "match" | "replace", value: string): void {
    const currentPronunciations = this.bookContext.book?.pronunciation || [];
    const newPronunciations = currentPronunciations.map((pronunciation, i) =>
      i === index ? { ...pronunciation, [field]: value } : pronunciation,
    );
    this.bookContext.book!.pronunciation = newPronunciations;
    this.debounceHandler.debounce(() => {
      updateBookService.fetch({
        name: this.bookContext.book!.id,
        book: this.bookContext.book!,
      });
      dispatch(this, SaveEvent());
    });
  }
}
