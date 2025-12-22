import { provide } from "@lit/context";
import { property } from "lit/decorators.js";
import { BooksContext, booksContext } from "./context.js";
import { LoadingStatus } from "../shared/type.loading.js";
import { listBooksService } from "../shared/service.list-books.js";
import { InklifyAppProvider } from "./provider.app.js";

export abstract class InklifyBookListProvider extends InklifyAppProvider {
  @provide({ context: booksContext })
  @property({ attribute: false })
  booksContext: BooksContext = {
    status: LoadingStatus.enum.idle,
  };

  override async connectedCallback(): Promise<void> {
    super.connectedCallback();
    this.load();
  }

  override async load(): Promise<void> {
    await super.load();
    this.booksContext = {
      books: await listBooksService.fetch(),
      status: LoadingStatus.enum.success,
    };
  }
}
