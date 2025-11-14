import { provide } from "@lit/context";
import { LitElement } from "lit";
import { property } from "lit/decorators.js";
import {
  BookContext,
  bookContext,
  BooksContext,
  booksContext,
} from "./context.book.js";
import { LoadingStatus } from "../shared/type.loading.js";
import { parseRouteParams } from "../shared/util.route-params.js";
import "./component.book-editor.js";
import { listBooksService } from "../shared/service.list-books.js";

export abstract class TorlifyBookListProvider extends LitElement {
  params = parseRouteParams("/", window.location.pathname, true);

  @provide({ context: booksContext })
  @property({ attribute: false })
  booksContext: BooksContext = {
    status: LoadingStatus.enum.idle,
  };

  @provide({ context: bookContext })
  @property({ attribute: false })
  bookContext: BookContext = {
    status: LoadingStatus.enum.idle,
  };

  override async connectedCallback(): Promise<void> {
    super.connectedCallback();

    this.booksContext = {
      books: await listBooksService.fetch({ bodyParams: undefined, pathParams: {} }),
      status: LoadingStatus.enum.success,
    };
  }
}
