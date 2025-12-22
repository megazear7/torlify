import { LitElement } from "lit";
import "./component.book-editor.js";
import { query } from "lit/decorators.js";
import { InklifyBookList } from "./component.book-list.js";
import { ScrollToEventDetail, ScrollToEventTarget } from "./event.scroll-to.js";
import { InklifyPartList } from "./component.part-list.js";
import { InklifyChapterList } from "./component.chapter-list.js";

export abstract class InklifyAbstractProvider extends LitElement {
  abstract load(): Promise<void>;

  @query("inklify-book-list")
  bookListElement!: InklifyBookList;

  @query("inklify-chapter-list")
  chapterListElement!: InklifyChapterList;

  @query("inklify-part-list")
  partListElement!: InklifyPartList;

  override async connectedCallback(): Promise<void> {
    super.connectedCallback();
    this.addEventListener("ScrollTo", this.handleScrollTo);
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.removeEventListener("ScrollTo", this.handleScrollTo);
  }

  private handleScrollTo = (event: Event): void => {
    const { target } = ScrollToEventDetail.parse((event as CustomEvent).detail);

    if (target === ScrollToEventTarget.enum.book) {
      this.bookListElement.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    } else if (target === ScrollToEventTarget.enum.chapter) {
      this.chapterListElement.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    } else if (target === ScrollToEventTarget.enum.part) {
      this.partListElement.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };
}
