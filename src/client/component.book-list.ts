import { html, css, LitElement, TemplateResult } from "lit";
import { customElement, property } from "lit/decorators.js";
import { LoadingStatus } from "../shared/type.loading.js";
import { BooksContext, booksContext } from "./context.book.js";
import { consume } from "@lit/context";
import { globalStyles } from "./styles.global.js";
import "./component.modal.js";

@customElement("torlify-book-list")
export class TorlifyBookList extends LitElement {
  static override styles = [globalStyles, css``];

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
        <li>
          <torlify-modal>
            <h2>Add New Book</h2>
            <p>TODO: Add book form goes here.</p>
          </torlify-modal>
        </li>
      </ul>
    `;
  }
}
