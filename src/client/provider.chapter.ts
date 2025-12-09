import { provide } from "@lit/context";
import { property } from "lit/decorators.js";
import { ChapterContext, chapterContext } from "./context.js";
import { LoadingStatus } from "../shared/type.loading.js";
import { parseRouteParams } from "../shared/util.route-params.js";
import { TorlifyBookProvider } from "./provider.book.js";

export abstract class TorlifyChapterProvider extends TorlifyBookProvider {
  @provide({ context: chapterContext })
  @property({ attribute: false })
  chapterContext: ChapterContext = {
    status: LoadingStatus.enum.idle,
  };

  override async connectedCallback(): Promise<void> {
    await super.connectedCallback();
    await this.load();
  }

  override async load(): Promise<void> {
    await super.load();
    const params = parseRouteParams("/book/:bookId/chapter/:chapterId", window.location.pathname, true);
    this.chapterContext = {
      chapter: this.bookContext.book?.chapters[Number(params.chapterId) - 1] || undefined,
      status: LoadingStatus.enum.success,
    };
  }
}
