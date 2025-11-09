import { html, css, LitElement, TemplateResult } from "lit";
import { customElement, property } from "lit/decorators.js";
import { LoadingStatus } from "../shared/type.loading.js";
import { BooksContext, booksContext } from "./context.book.js";
import { consume } from "@lit/context";

@customElement("torlify-book-list")
export class TorlifyBookList extends LitElement {
  static override styles = css`
    p {
      color: var(--color-1);
    }
  `;

  @consume({ context: booksContext, subscribe: true })
  @property({ attribute: false })
  booksContext: BooksContext = {
    status: LoadingStatus.enum.idle,
  };

  override render(): TemplateResult {
    return html`
      <h3>Books</h3>
      <ul>
        <li><a href="/">Home</a></li>
        ${this.booksContext.books?.map(
          (book) => html`
            <li><a href="/book/${book.id}">${book.title}</a></li>
          `,
        ) ?? html`<li>No books found</li>`}
      </ul>
    `;
  }
}
