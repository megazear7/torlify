import { html, css, TemplateResult } from "lit";
import { customElement } from "lit/decorators.js";
import { parseRouteParams } from '../shared/util.route-params.js';
import { TorlifyAbstractBookPage } from './abstract.book.js';
import "./element.book-list.js";
import "./element.book-editor.js"
import "./element.chapter-list.js"

@customElement("torlify-chapter-page")
export class TorlifyChapterPage extends TorlifyAbstractBookPage {
  static override styles = css`
    p {
      color: var(--color-1);
    }
  `;

  override params = parseRouteParams("/book/:bookId/chapter/:chapterId", window.location.pathname);

  override render(): TemplateResult {
    return html`
      <p>Chapter Page!</p>
      <torlify-book-list></torlify-book-list>
      <torlify-book-editor></torlify-book-editor>
      <torlify-chapter-list></torlify-chapter-list>
    `;
  }
}
