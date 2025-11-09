import { html, css, TemplateResult } from "lit";
import { customElement } from "lit/decorators.js";
import { LoadingStatus } from '../shared/type.loading.js';
import { parseRouteParams } from '../shared/util.route-params.js';
import { TorlifyAbstractBookPage } from './abstract.book.js';
import "./element.book-list.js";
import "./element.book-editor.js"

@customElement("torlify-book-page")
export class TorlifyBookPage extends TorlifyAbstractBookPage {
  static override styles = css`
    p {
      color: var(--color-1);
    }
  `;

  override params = parseRouteParams("/book/:bookId", window.location.pathname);

  override render(): TemplateResult {
    if (this.bookContext.status === LoadingStatus.enum.error && !this.bookContext.book) {
      return html`<p>Book not found.</p>`;
    }

    return html`
      <p>Book Page!</p>
      <torlify-book-list></torlify-book-list>
      <torlify-book-editor></torlify-book-editor>
    `;
  }
}
