import { html, css, LitElement, TemplateResult } from "lit";
import { customElement, property, query } from "lit/decorators.js";
import { globalStyles } from "./styles.global.js";

export const AUTO_TEXTAREA_TAG_NAME = "torlify-auto-textarea";

@customElement(AUTO_TEXTAREA_TAG_NAME)
export class TorlifyAutoTextarea extends LitElement {
  static override styles = [
    globalStyles,
    css`
      textarea {
        width: 100%;
        box-sizing: border-box;
        padding: var(--size-large);
        border: 1px solid var(--color-grey-transparent);
        border-radius: var(--radius-medium);
        background: transparent;
        color: var(--color-secondary-text);
        min-height: var(--font-medium);
        font-family: var(--font-family);
        font-size: var(--font-medium);
        line-height: 1.6;
        transition: var(--transition-all);
        margin-bottom: var(--size-large);
        resize: none;
        overflow-y: hidden;
      }

      textarea:focus {
        outline: none;
        border-color: var(--color-1);
        box-shadow: var(--shadow-active);
        background: var(--color-secondary-surface-active);
      }

      textarea::placeholder {
        color: var(--color-grey-transparent);
      }

      textarea.h2 {
        padding: var(--size-xl) var(--size-large);
        margin: 0;
        line-height: 0;
      }
    `,
  ];

  @property({ type: String })
  value = "";

  @property({ type: String })
  heading = "";

  @property({ type: String })
  placeholder = "";

  @query("textarea")
  private textarea!: HTMLTextAreaElement;

  override firstUpdated(): void {
    this.adjustHeight();
  }

  override updated(): void {
    this.adjustHeight();
  }

  override render(): TemplateResult {
    return html`
      <textarea
        class="${this.heading}"
        placeholder="${this.placeholder}"
        .value="${this.value}"
        @input="${this.handleInput}"
        @change="${this.handleChange}"
      ></textarea>
    `;
  }

  override connectedCallback(): void {
    super.connectedCallback();
    this.value = this.value || this.placeholder;
  }

  private handleInput(event: Event): void {
    const target = event.target as HTMLTextAreaElement;
    this.value = target.value;
    this.adjustHeight();
    this.dispatchEvent(
      new CustomEvent("input", { detail: { value: this.value } }),
    );
  }

  private handleChange(event: Event): void {
    const target = event.target as HTMLTextAreaElement;
    this.value = target.value;
    this.dispatchEvent(
      new CustomEvent("change", { detail: { value: this.value } }),
    );
  }

  adjustHeight(): void {
    if (this.textarea && !this.heading) {
      this.textarea.style.height = "auto";
      this.textarea.style.height = `${this.textarea.scrollHeight}px`;
    }
  }
}
