import { html, TemplateResult } from "lit";
import { customElement } from "lit/decorators.js";
import { LoadingStatus } from "../shared/type.loading.js";
import { TorlifyBookProvider } from "./provider.book.js";
import "./component.book-list.js";
import "./component.book-editor.js";
import "./component.chapter-list.js";
import { globalStyles } from "./styles.global.js";

@customElement("torlify-book-page")
export class TorlifyBookPage extends TorlifyBookProvider {
  static override styles = [globalStyles];

  override render(): TemplateResult {
    if (
      this.bookContext.status === LoadingStatus.enum.error &&
      !this.bookContext.book
    ) {
      return html`<p>Book not found.</p>`;
    }

    return html`
      <div class="container">
        <torlify-book-list activeBookId="${this.bookContext.book?.id}"></torlify-book-list>
        <torlify-chapter-list></torlify-chapter-list>
        <torlify-book-editor></torlify-book-editor>
      </div>
    `;
  }
}
