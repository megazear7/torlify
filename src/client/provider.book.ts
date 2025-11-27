import { provide } from "@lit/context";
import { property } from "lit/decorators.js";
import { BookContext, bookContext } from "./context.book.js";
import { LoadingStatus } from "../shared/type.loading.js";
import { parseRouteParams } from "../shared/util.route-params.js";
import { getBookService } from "../shared/service.get-book.js";
import { TorlifyBookListProvider } from "./provider.book-list.js";

export abstract class TorlifyBookProvider extends TorlifyBookListProvider {
  @provide({ context: bookContext })
  @property({ attribute: false })
  bookContext: BookContext = {
    status: LoadingStatus.enum.idle,
  };

  override async connectedCallback(): Promise<void> {
    super.connectedCallback();
    this.load();
  }

  override async load(): Promise<void> {
    await super.load();
    const params = parseRouteParams(
      "/book/:bookId",
      window.location.pathname,
      true,
    );
    this.bookContext = {
      book: await getBookService.fetch({ bookId: params.bookId }),
      status: LoadingStatus.enum.success,
    };
  }
}
