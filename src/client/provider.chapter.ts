import { provide } from "@lit/context";
import { property } from "lit/decorators.js";
import { ChapterContext, chapterContext } from "./context.book.js";
import { LoadingStatus } from "../shared/type.loading.js";
import { parseRouteParams } from "../shared/util.route-params.js";
import "./element.book-editor.js";
import { TorlifyBookProvider } from "./provider.book.js";

export abstract class TorlifyChapterProvider extends TorlifyBookProvider {
  override params = parseRouteParams(
    "/book/:bookId/chapter/:chapterId",
    window.location.pathname,
    true,
  );

  @provide({ context: chapterContext })
  @property({ attribute: false })
  chapterContext: ChapterContext = {
    status: LoadingStatus.enum.idle,
  };

  override async connectedCallback(): Promise<void> {
    await super.connectedCallback();

    this.chapterContext = {
      chapter:
        this.bookContext.book?.chapters[Number(this.params.chapterId) - 1] ||
        undefined,
      status: LoadingStatus.enum.success,
    };
  }
}
