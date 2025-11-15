import { consume } from "@lit/context";
import { html, css, LitElement, TemplateResult } from "lit";
import { customElement, property } from "lit/decorators.js";
import { BookContext, bookContext } from "./context.book.js";
import { LoadingStatus } from "../shared/type.loading.js";
import { globalStyles } from "./styles.global.js";

@customElement("torlify-chapter-list")
export class TorlifyChapterList extends LitElement {
  static override styles = [globalStyles, css`
    .chapter-list-container {
      display: flex;
    }
  
    .chapter-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-right: var(--size-small);
    }

    .chapter-label {
      display: block;
      width: 100%;
      text-align: center;
    }

    .chapter-label a {
      color: var(--color-primary-text-dark);
      text-decoration: none;
      font-size: var(--font-small);
      transition: color var(--time-normal) ease-in-out;
    }

    .chapter-label a:hover {
      color: var(--color-primary-text);
    }

    .parts-list {
      display: flex;
      gap: var(--size-nano);
    }
  
    .part-item {
      width: 20px;
      height: 20px;
      background-color: var(--color-secondary-surface);
      transition: background-color var(--time-normal) ease-in-out;
    }

    .part-item::after {
      content: "";
      display: block;
      width: 100%;
      height: 0px;
      transition: var(--transition-all);
    }

    .part-item.has-text::after {
      height: 10px;
      background-color: var(--color-2);
    }

    .part-item.has-text:first-child::after {
      border-radius: var(--radius-medium) 0 0 0;
    }

    .part-item.has-text:last-child::after {
      border-radius: 0 var(--radius-medium) 0 0;
    }

    .part-item:hover::after {
      height: 20px;
      background-color: var(--color-2);
    }

    .part-item:hover:first-child::after {
      border-radius: var(--radius-medium) 0 0 var(--radius-medium);
    }

    .part-item:hover:last-child::after {
      border-radius: 0 var(--radius-medium) var(--radius-medium) 0;
    }

    .part-item:last-child {
      border-radius: 0 var(--radius-medium) var(--radius-medium) 0;
    }

    .part-item:first-child {
      border-radius: var(--radius-medium) 0 0 var(--radius-medium);
    }

    .part-item.single-part, .part-item.single-part:hover::after {
      border-radius: var(--radius-medium);
    }

    .part-item.has-text.has-audio {
      background-color: var(--color-1);
    }
  `];

  @consume({ context: bookContext, subscribe: true })
  @property({ attribute: false })
  public bookContext: BookContext = {
    status: LoadingStatus.enum.idle,
  };

  override render(): TemplateResult {
    const book = this.bookContext.book;

    if (!book) {
      return html`<p>No book selected.</p>`;
    }

    return html`
      <div class="chapter-list-container">
        ${book.chapters.map(
          (chapter, chapterIndex) => html`
            <div class="chapter-item">
              <div class="chapter-label">
                <a href="/book/${book.id}/chapter/${chapterIndex + 1}">Chapter ${chapterIndex + 1}</a>
              </div>
              <div class="parts-list">
                ${chapter.parts.map(
                  (part, partIndex) => html`
                    <a class="part-item ${chapter.parts.length === 1 ? 'single-part' : ''} ${part.audio ? 'has-audio' : ''} ${part.text ? 'has-text' : ''}" href="/book/${book.id}/chapter/${chapterIndex + 1}/part/${partIndex + 1}"></a>
                  `
                )}
              </div>
            </div>
          `,
        ) ?? html`<div>No chapters found</div>`}
      </div>
    `;
  }
}
