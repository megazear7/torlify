import { css, html, LitElement, TemplateResult } from "lit";
import { customElement, property } from "lit/decorators.js";
import { globalStyles } from "./styles.global.js";

@customElement("torlify-spinner")
export class TorlifySpinner extends LitElement {
  static override styles = [
    globalStyles,
    css`
      .spinner {
        display: inline-block;
        width: 1em;
        height: 1em;
        border: 2px solid var(--color-grey-transparent);
        border-radius: 50%;
        border-top-color: var(--color-1);
        animation: spin 1s ease-in-out infinite;
        box-sizing: border-box;
        position: relative;
        top: 1.5px;
      }

      @keyframes spin {
        to {
          transform: rotate(360deg);
        }
      }
    `,
  ];

  @property({ type: Number })
  public size = 16;

  override render(): TemplateResult {
    return html`
      <div
        class="spinner"
        style="width: ${this.size}px; height: ${this.size}px; border-width: ${Math.max(
          2,
          Math.floor(this.size / 6),
        )}px;"></div>
    `;
  }
}
