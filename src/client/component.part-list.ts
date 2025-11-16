import { html, LitElement, TemplateResult } from "lit";
import { customElement, property } from "lit/decorators.js";
import { LoadingStatus } from "../shared/type.loading.js";
import {
  bookContext,
  BookContext,
  chapterContext,
  ChapterContext,
} from "./context.book.js";
import { consume } from "@lit/context";
import { globalStyles } from "./styles.global.js";
import { pillStyles } from "./styles.pill.js";

@customElement("torlify-part-list")
export class TorlifyPartList extends LitElement {
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

  @property({ type: Number })
  selectedPart: number | null = null;

  override render(): TemplateResult {
    return html`
      <ul class="pill">
        ${this.chapterContext.chapter?.parts.map(
          (_, index) => html`
            <li class="${this.selectedPart === index + 1 ? 'active' : ''}">
              <a href="/book/${this.bookContext.book?.id}/chapter/${this
                  .chapterContext.chapter?.number}/part/${index + 1}"
                >Part ${index + 1}</a
              >
            </li>
          `,
        ) ?? html`<li>No parts found</li>`}
      </ul>
    `;
  }
}
