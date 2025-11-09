import { html, css, LitElement, TemplateResult } from "lit";
import { customElement } from "lit/decorators.js";
import "./element.book-editor.js"

@customElement("torlify-not-found-page")
export class TorlifyNotFoundPage extends LitElement {
  static override styles = css`
    p {
      color: var(--color-1);
    }
  `;

  override render(): TemplateResult {
    return html`
      <p>Not Found Page!</p>
    `;
  }
}
