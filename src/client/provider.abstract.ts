import { LitElement } from "lit";
import "./component.book-editor.js";
import { query } from "lit/decorators.js";
import { TorlifyBookList } from "./component.book-list.js";
import { ScrollToEventDetail, ScrollToEventTarget } from "./event.scroll-to.js";
import { TorlifyPartList } from "./component.part-list.js";
import { TorlifyChapterEditor } from "./component.chapter-editor.js";

export abstract class TorlifyAbstractProvider extends LitElement {
  abstract load(): Promise<void>;

  @query("torlify-book-list")
  bookListElement!: TorlifyBookList;

  @query("torlify-chapter-editor")
  chapterEditorElement!: TorlifyChapterEditor;

  @query("torlify-part-list")
  partListElement!: TorlifyPartList;

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
      this.chapterEditorElement.scrollIntoView({
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
