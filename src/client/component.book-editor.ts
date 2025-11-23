import { consume } from "@lit/context";
import { css, html, LitElement, TemplateResult } from "lit";
import { customElement, property } from "lit/decorators.js";
import { BookContext, bookContext } from "./context.book.js";
import { LoadingStatus } from "../shared/type.loading.js";
import { globalStyles } from "./styles.global.js";
import { formatNumber } from "../shared/util.number.js";
import { dispatch } from "./util.events.js";
import { UpdateBookEvent } from "./event.update-book.js";
import { buildNestedObject } from "../shared/util.property.js";
import { BookPartial } from "../shared/type.book.js";
import { WarningEvent } from "./event.warning.js";
import "./component.auto-textarea.js";

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

  override render(): TemplateResult {
    return html`
      ${this.bookContext.book
        ? html`
            <div class="button-bar">
              <button @click=${() => dispatch(this, WarningEvent("Not implemented"))} class="standard-button">Download</button>
              <button @click=${() => dispatch(this, WarningEvent("Not implemented"))} class="standard-button">Configure</button>
              <button @click=${() => dispatch(this, WarningEvent("Not implemented"))} class="standard-button">Details</button>
              <button @click=${() => dispatch(this, WarningEvent("Not implemented"))} class="standard-button">Generate</button>
            </div>
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

  save(prop: string): (event: CustomEvent) => void {
    return (event: CustomEvent): void => {
      if (event.detail.value) {
        const updateData = buildNestedObject(
          BookPartial,
          prop,
          event.detail.value,
        );
        dispatch(this, UpdateBookEvent(updateData));
      }
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
