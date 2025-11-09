import { consume } from "@lit/context";
import { html, css, LitElement, TemplateResult } from "lit";
import { customElement, property } from "lit/decorators.js";
import { BookContext, bookContext } from "./context.book.js";
import { LoadingStatus } from "../shared/type.loading.js";

@customElement("torlify-book-editor")
export class TorlifyBookEditor extends LitElement {
  static override styles = css`
    p {
      color: var(--color-1);
    }
  `;

  @consume({ context: bookContext, subscribe: true })
  @property({ attribute: false })
  public bookContext: BookContext = {
    status: LoadingStatus.enum.idle,
  };

  override render(): TemplateResult {
    return html`
      ${this.bookContext.book
        ? html`<h2>${this.bookContext.book.title}</h2>`
        : html`<p>Loading book...</p>`}
    `;
  }
}
