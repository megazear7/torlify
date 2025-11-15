import { html, TemplateResult } from "lit";
import { customElement } from "lit/decorators.js";
import { parseRouteParams } from "../shared/util.route-params.js";
import { TorlifyChapterProvider } from "./provider.chapter.js";
import "./component.book-list.js";
import "./component.book-editor.js";
import "./component.chapter-list.js";
import "./component.chapter-editor.js";
import "./component.part-list.js";
import { globalStyles } from "./styles.global.js";

@customElement("torlify-chapter-page")
export class TorlifyChapterPage extends TorlifyChapterProvider {
  override params = parseRouteParams(
    "/book/:bookId/chapter/:chapterId",
    window.location.pathname,
  );

  static override styles = [globalStyles];

  override render(): TemplateResult {
    return html`
      <div class="container">
        <torlify-book-list></torlify-book-list>
        <torlify-book-editor></torlify-book-editor>
        <torlify-chapter-list></torlify-chapter-list>
        <torlify-chapter-editor></torlify-chapter-editor>
        <torlify-part-list></torlify-part-list>
      </div>
    `;
  }
}
