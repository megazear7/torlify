import { html, LitElement, TemplateResult } from "lit";
import { customElement } from "lit/decorators.js";
import "./component.book-editor.js";
import { globalStyles } from "./styles.global.js";

@customElement("torlify-not-found-page")
export class TorlifyNotFoundPage extends LitElement {
  static override styles = [globalStyles];

  override render(): TemplateResult {
    return html`<h1>Not Found!</h1>`;
  }
}
