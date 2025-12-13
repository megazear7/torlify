import { css, html, LitElement, TemplateResult } from "lit";
import { customElement, property } from "lit/decorators.js";
import { globalStyles } from "./styles.global.js";

@customElement("torlify-bar")
export class TorlifyBar extends LitElement {
  static override styles = [
    globalStyles,
    css`
      .bar-container {
        display: inline-block;
        margin-top: var(--size-xl);
      }

      .bar {
        display: flex;
        box-shadow: var(--shadow-normal);
      }

      .bar-label {
        text-decoration: italic;
        margin-bottom: var(--size-small);
        color: var(--color-secondary-text-muted);
        font-size: var(--font-small);
      }
    `,
  ];

  @property({ type: String })
  public label: string = "";

  override render(): TemplateResult {
    return html`
      <div class="bar-container">
        ${this.label
          ? html`
              <div class="bar-label">${this.label}</div>
            `
          : ""}
        <div class="bar">
          <slot></slot>
        </div>
      </div>
    `;
  }
}
