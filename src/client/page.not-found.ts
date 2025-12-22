import { html, LitElement, TemplateResult } from "lit";
import { customElement } from "lit/decorators.js";
import "./component.book-editor.js";
import { globalStyles } from "./styles.global.js";

@customElement("inklify-not-found-page")
export class InklifyNotFoundPage extends LitElement {
  static override styles = [globalStyles];

  override render(): TemplateResult {
    return html`
      <h1>Not Found!</h1>
    `;
  }
}
