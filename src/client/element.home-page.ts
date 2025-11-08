import { html, css, LitElement, TemplateResult } from "lit";
import { customElement, property } from "lit/decorators.js";
import { BookMinimalInfo } from "../shared/type.book.js";
import { parseRouteParams } from "../shared/util.route-params.js";

@customElement("torlify-home-page")
export class TorlifyHomePage extends LitElement {
  static override styles = css`
    p {
      color: var(--color-1);
    }
  `;

  params = parseRouteParams("/", window.location.pathname);

  @property() books: BookMinimalInfo[] = [{ id: "book1", title: "Book 1" }, { id: "book2", title: "Book 2" }];

  override render(): TemplateResult {
    return html`
      <p>Home Page!</p>
      <ul>
        ${this.books.map(book => html`<li>${book.title}</li>`)}
      </ul>
    `;
  }

  override async connectedCallback(): Promise<void> {
    super.connectedCallback();
  }
}
