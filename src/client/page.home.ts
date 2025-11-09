import { html, css, LitElement, TemplateResult } from "lit";
import { customElement, property } from "lit/decorators.js";
import { parseRouteParams } from "../shared/util.route-params.js";
import { LoadingStatus } from "../shared/type.loading.js";
import { BooksContext, booksContext } from "./context.book.js";
import { provide } from "@lit/context";
import { booksApi } from "./api.book.js";
import "./element.book-list.js";

@customElement("torlify-home-page")
export class TorlifyHomePage extends LitElement {
  static override styles = css`
    p {
      color: var(--color-1);
    }
  `;

  params = parseRouteParams("/", window.location.pathname);

  @provide({context: booksContext})
  @property({attribute: false})
  booksContext: BooksContext = {
    status: LoadingStatus.enum.idle,
  }

  override render(): TemplateResult {
    return html`
      <p>Home Page!</p>
      <torlify-book-list></torlify-book-list>
    `;
  }

  override async connectedCallback(): Promise<void> {
    super.connectedCallback();

    this.booksContext = {
        books: await booksApi(),
        status: LoadingStatus.enum.success,
    };

    console.log("Books context set in home page:", this.booksContext);
  }
}
