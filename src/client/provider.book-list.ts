import { provide } from "@lit/context";
import { property } from "lit/decorators.js";
import { BooksContext, booksContext } from "./context.js";
import { LoadingStatus } from "../shared/type.loading.js";
import "./component.book-editor.js";
import { listBooksService } from "../shared/service.list-books.js";
import { TorlifyAbstractProvider } from "./provider.abstract.js";

export abstract class TorlifyBookListProvider extends TorlifyAbstractProvider {
  @provide({ context: booksContext })
  @property({ attribute: false })
  booksContext: BooksContext = {
    status: LoadingStatus.enum.idle,
  };

  override async connectedCallback(): Promise<void> {
    super.connectedCallback();
    this.load();
  }

  async load(): Promise<void> {
    this.booksContext = {
      books: await listBooksService.fetch(),
      status: LoadingStatus.enum.success,
    };
  }
}
