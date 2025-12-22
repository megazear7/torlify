import { html, css, LitElement, TemplateResult } from "lit";
import { customElement, property } from "lit/decorators.js";
import { globalStyles } from "./styles.global.js";
import { checkIcon, xIcon } from "./icons.js";

export const CHECKBOX_TAG_NAME = "inklify-checkbox";

@customElement(CHECKBOX_TAG_NAME)
export class InklifyCheckbox extends LitElement {
  static override styles = [
    globalStyles,
    css`
      .checkbox-group {
        display: flex;
        flex-wrap: wrap;
        gap: var(--size-small);
      }

      .checkbox-label {
        display: flex;
        align-items: center;
        gap: var(--size-small);
        cursor: pointer;
        border-radius: var(--size-large);
        text-transform: capitalize;
        padding: var(--size-medium);
        transition: var(--transition-all);
        background-color: #00000033;
        color: white;
      }

      .checkbox-label:hover {
        background: var(--color-2);
      }

      input[type="checkbox"] {
        display: none;
      }

      .checkbox-label.checked {
        background-color: var(--color-1);
      }
    `,
  ];

  @property({ type: String })
  text: string = "Checkbox";

  @property({ type: String })
  off: string | null = null;

  @property({ type: String })
  on: string | null = null;

  @property({ type: String, attribute: false })
  onIcon = checkIcon;

  @property({ type: String, attribute: false })
  offIcon = xIcon;

  @property({ type: Boolean, attribute: false })
  checked = false;

  override render(): TemplateResult {
    return html`
      <div class="checkbox-group">
        <label class="checkbox-label ${this.checked ? "checked" : ""}" for="checkbox">
          <input type="checkbox" id="checkbox" .checked="${this.checked}" @change=${this.handleChange} />
          ${this.checked ? this.onIcon : this.offIcon}
          <span class="checkbox-text">${this.checked ? this.on || this.text : this.off || this.text}</span>
        </label>
      </div>
    `;
  }

  private handleChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.checked = target.checked;
    this.dispatchEvent(new CustomEvent("change", { detail: { checked: this.checked } }));
  }
}
