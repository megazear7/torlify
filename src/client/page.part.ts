import { html, css, TemplateResult } from "lit";
import { customElement } from "lit/decorators.js";
import { parseRouteParams } from '../shared/util.route-params.js';
import { TorlifyAbstractBookPage } from './abstract.book.js';
import "./element.book-list.js";
import "./element.book-editor.js"

@customElement("torlify-part-page")
export class TorlifyPartPage extends TorlifyAbstractBookPage {
  static override styles = css`
    p {
      color: var(--color-1);
    }
  `;

  override params = parseRouteParams("/book/:bookId/chapter/:chapterId/part/:partId", window.location.pathname);

  override render(): TemplateResult {
    return html`
      <p>Part Page!</p>
      <torlify-book-list></torlify-book-list>
      <torlify-book-editor></torlify-book-editor>
    `;
  }
}
