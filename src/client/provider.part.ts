import { provide } from "@lit/context";
import { property } from "lit/decorators.js";
import { LoadingStatus } from "../shared/type.loading.js";
import { parseRouteParams } from "../shared/util.route-params.js";
import { TorlifyChapterProvider } from "./provider.chapter.js";
import { PartContext, partContext } from "./context.book.js";

export abstract class TorlifyPartProvider extends TorlifyChapterProvider {
  @provide({ context: partContext })
  @property({ attribute: false })
  partContext: PartContext = {
    status: LoadingStatus.enum.idle,
  };

  override async connectedCallback(): Promise<void> {
    await super.connectedCallback();
    await this.load();
  }

  override async load(): Promise<void> {
    await super.load();
    const params = parseRouteParams(
      "/book/:bookId/chapter/:chapterId/part/:partId",
      window.location.pathname,
      true,
    );
    this.partContext = {
      part:
        this.chapterContext.chapter?.parts[Number(params.partId) - 1] ||
        undefined,
      status: LoadingStatus.enum.success,
    };
  }
}
