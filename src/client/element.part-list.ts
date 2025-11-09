import { html, css, LitElement, TemplateResult } from "lit";
import { customElement, property } from "lit/decorators.js";
import { LoadingStatus } from "../shared/type.loading.js";
import {
  bookContext,
  BookContext,
  chapterContext,
  ChapterContext,
} from "./context.book.js";
import { consume } from "@lit/context";

@customElement("torlify-part-list")
export class TorlifyPartList extends LitElement {
  static override styles = css`
    p {
      color: var(--color-1);
    }
  `;

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
      <h3>Parts</h3>
      <ul>
        ${this.chapterContext.chapter?.parts.map(
          (_, index) => html`
            <li>
              <a
                href="/book/${this.bookContext.book?.id}/chapter/${this
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
