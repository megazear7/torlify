import { html, TemplateResult } from "lit";
import { customElement } from "lit/decorators.js";
import { parseRouteParams } from "../shared/util.route-params.js";
import { TorlifyPartProvider } from "./provider.part.js";
import "./component.book-list.js";
import "./component.book-editor.js";
import "./component.chapter-list.js";
import "./component.chapter-editor.js";
import "./component.part-list.js";
import "./component.part-editor.js";
import { globalStyles } from "./styles.global.js";

@customElement("torlify-part-page")
export class TorlifyPartPage extends TorlifyPartProvider {
  params = parseRouteParams(
    "/book/:bookId/chapter/:chapterId/part/:partId",
    window.location.pathname,
  );

  static override styles = [globalStyles];

  override render(): TemplateResult {
    return html`
      <div class="container">
        <torlify-book-list activeBookId="${this.params.bookId}"></torlify-book-list>
        <torlify-chapter-list></torlify-chapter-list>
        <torlify-book-editor></torlify-book-editor>
        <torlify-chapter-editor></torlify-chapter-editor>
        <torlify-part-list selectedPart="${this.params.partId}"></torlify-part-list>
        <torlify-part-editor></torlify-part-editor>
      </div>
    `;
  }
}
