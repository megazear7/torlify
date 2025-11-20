import { css, html, LitElement, TemplateResult } from "lit";
import { customElement, property } from "lit/decorators.js";
import { globalStyles } from "./styles.global.js";
import { consume } from "@lit/context";
import {
  BookContext,
  bookContext,
  booksContext,
  BooksContext,
  ChapterContext,
  chapterContext,
  PartContext,
  partContext,
} from "./context.book.js";
import { LoadingStatus } from "../shared/type.loading.js";
import { ScrollToEvent } from "./event.scroll-to.js";
import { dispatch } from "./util.events.js";

@customElement("torlify-bookmark-tabs")
export class TorlifyBookmarkTabs extends LitElement {
  static override styles = [
    globalStyles,
    css`
      :host {
        position: fixed;
        left: 0;
        top: 50%;
        transform: translateY(-50%);
        z-index: 1000;
      }

      .bookmark-tabs {
        display: flex;
        flex-direction: column;
        gap: var(--size-small);
      }

      .bookmark-button {
        width: var(--size-xl);
        height: var(--size-xl);
        background-color: var(--color-secondary-surface);
        border: none;
        border-radius: 0 var(--radius-medium) var(--radius-medium) 0;
        color: var(--color-primary-text);
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: var(--font-medium);
        transition: var(--transition-all);
        box-shadow: var(--shadow-normal);
      }

      .bookmark-button:hover:not(:disabled) {
        background-color: var(--color-secondary-light);
        transform: var(--transform-hover);
        box-shadow: var(--shadow-hover);
      }

      .bookmark-button:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
    `,
  ];

  @consume({ context: booksContext, subscribe: true })
  @property({ attribute: false })
  public booksContext: BooksContext = {
    status: LoadingStatus.enum.idle,
  };

  @consume({ context: bookContext, subscribe: true })
  @property({ attribute: false })
  public bookContext: BookContext = {
    status: LoadingStatus.enum.idle,
  };

  @consume({ context: chapterContext, subscribe: true })
  @property({ attribute: false })
  public chapterContext: ChapterContext = {
    status: LoadingStatus.enum.idle,
  };

  @consume({ context: partContext, subscribe: true })
  @property({ attribute: false })
  public partContext: PartContext = {
    status: LoadingStatus.enum.idle,
  };

  private handleBookClick(): void {
    dispatch(this, ScrollToEvent({ target: "book" }));
  }

  private handleChapterClick(): void {
    dispatch(this, ScrollToEvent({ target: "chapter" }));
  }

  private handlePartClick(): void {
    dispatch(this, ScrollToEvent({ target: "part" }));
  }

  override render(): TemplateResult {
    const bookAvailable = this.bookContext.book !== undefined;
    const chapterAvailable = this.chapterContext.chapter !== undefined;
    const partAvailable = this.partContext.part !== undefined;

    return html`
      <div class="bookmark-tabs">
        <button
          class="bookmark-button book"
          ?disabled=${!bookAvailable}
          @click=${this.handleBookClick}
          title="Scroll to Book"
        >
          B
        </button>
        <button
          class="bookmark-button chapter"
          ?disabled=${!chapterAvailable}
          @click=${this.handleChapterClick}
          title="Scroll to Chapter"
        >
          C
        </button>
        <button
          class="bookmark-button part"
          ?disabled=${!partAvailable}
          @click=${this.handlePartClick}
          title="Scroll to Part"
        >
          P
        </button>
      </div>
    `;
  }
}
