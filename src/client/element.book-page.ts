import { provide } from '@lit/context';
import { html, css, LitElement, TemplateResult } from "lit";
import { customElement } from "lit/decorators.js";
import { BookContext, bookContext } from "../client/context.book.js";
import { bookApi } from './api.book.js';
import { LoadingStatus } from '../shared/type.loading.js';
import "./element.book-editor.js"
import { parseRouteParams } from '../shared/util.route-params.js';

@customElement("torlify-book-page")
export class TorlifyBookPage extends LitElement {
  static override styles = css`
    p {
      color: var(--color-1);
    }
  `;

  params = parseRouteParams("/book/:bookId", window.location.pathname);

  @provide({context: bookContext})
  bookContext: BookContext = {
    status: LoadingStatus.enum.idle,
  }

  override render(): TemplateResult {
    return html`
      <p>Book Page!</p>
      <torlify-book-editor></torlify-book-editor>
    `;
  }

  override async connectedCallback(): Promise<void> {
    super.connectedCallback();

    this.bookContext = {
        book: await bookApi(this.params.bookId),
        status: LoadingStatus.enum.success,
    };
  }
}
