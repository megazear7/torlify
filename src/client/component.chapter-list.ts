import { html, LitElement, TemplateResult } from "lit";
import { customElement, property } from "lit/decorators.js";
import { LoadingStatus } from "../shared/type.loading.js";
import { bookContext, BookContext, chapterContext, ChapterContext } from "./context.js";
import { consume } from "@lit/context";
import { globalStyles } from "./styles.global.js";
import { pillStyles } from "./styles.pill.js";

@customElement("torlify-chapter-list")
export class TorlifyChapterList extends LitElement {
  static override styles = [globalStyles, pillStyles];

  @consume({ context: bookContext, subscribe: true })
  @property({ attribute: false })
  bookContext: BookContext = {
    status: LoadingStatus.enum.idle,
  };

  @consume({ context: chapterContext, subscribe: true })
  @property({ attribute: false })
  chapterContext: ChapterContext = {
    status: LoadingStatus.enum.idle,
  };

  override render(): TemplateResult {
    return html`
      <ul class="pill">
        ${this.bookContext.book?.chapters.map(
          (_, index) => html`
            <li class="${this.chapterContext.chapter?.number === index + 1 ? "active" : ""}">
              <a href="/book/${this.bookContext.book?.id}/chapter/${index + 1}">Chapter ${index + 1}</a>
            </li>
          `,
        ) ??
        html`
          <li>No chapters found</li>
        `}
      </ul>
    `;
  }
}
