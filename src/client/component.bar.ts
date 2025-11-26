import { css, html, LitElement, TemplateResult } from "lit";
import { customElement } from "lit/decorators.js";
import { globalStyles } from "./styles.global.js";

@customElement("torlify-bar")
export class TorlifyBar extends LitElement {
  static override styles = [
    globalStyles,
    css`
      .bar-container {
        display: inline-block;
      }

      .bar {
        display: flex;
        margin-top: var(--size-xl);
        box-shadow: var(--shadow-normal);
      }
    `,
  ];

  override render(): TemplateResult {
    return html`
      <div class="bar-container">
        <div class="bar">
          <slot></slot>
        </div>
      </div>
    `;
  }
}
