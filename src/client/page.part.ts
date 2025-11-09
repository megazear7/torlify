import { html, css, TemplateResult } from "lit";
import { customElement } from "lit/decorators.js";
import { parseRouteParams } from "../shared/util.route-params.js";
import { TorlifyPartProvider } from "./provider.part.js";
import "./element.book-list.js";
import "./element.book-editor.js";
import "./element.chapter-list.js";
import "./element.chapter-editor.js";
import "./element.part-list.js";
import "./element.part-editor.js";

@customElement("torlify-part-page")
export class TorlifyPartPage extends TorlifyPartProvider {
  static override styles = css`
    p {
      color: var(--color-1);
    }
  `;

  override params = parseRouteParams(
    "/book/:bookId/chapter/:chapterId/part/:partId",
    window.location.pathname,
  );

  override render(): TemplateResult {
    return html`
      <torlify-book-list></torlify-book-list>
      <torlify-book-editor></torlify-book-editor>
      <torlify-chapter-list></torlify-chapter-list>
      <torlify-chapter-editor></torlify-chapter-editor>
      <torlify-part-list></torlify-part-list>
      <torlify-part-editor></torlify-part-editor>
    `;
  }
}
