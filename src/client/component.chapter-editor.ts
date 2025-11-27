import { consume } from "@lit/context";
import { css, html, LitElement, TemplateResult } from "lit";
import { customElement, property } from "lit/decorators.js";
import {
  BookContext,
  bookContext,
  chapterContext,
  ChapterContext,
} from "./context.book.js";
import { LoadingStatus } from "../shared/type.loading.js";
import { globalStyles } from "./styles.global.js";
import { dispatch } from "./util.events.js";
import { WarningEvent } from "./event.warning.js";
import { DebounceHandler } from "./util.debounce.js";
import { SaveEvent } from "./event.save.js";
import { updateChapterService } from "../shared/service.update-chapter.js";
import { BookId, Chapter } from "../shared/type.book.js";
import { AUTO_TEXTAREA_TAG_NAME } from "./component.auto-textarea.js";
import "./component.auto-textarea.js";
import "./component.bar.js";

@customElement("torlify-chapter-editor")
export class TorlifyChapterEditor extends LitElement {
  static override styles = [
    globalStyles,
    css`
      :host {
        scroll-margin-top: var(--size-xl);
      }
    `,
  ];

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

  private debounceHandler = new DebounceHandler();

  override render(): TemplateResult {
    return html`
      ${this.chapterContext.chapter
        ? html`
            <div class="secondary-surface">
              <h4>Chapter ${this.chapterContext.chapter.number}</h4>
              <torlify-auto-textarea
                cssClass="h2"
                .value="${this.chapterContext.chapter.title}"
                @input="${this.updateProperty("title")}"
              ></torlify-auto-textarea>
            </div>
            <div class="secondary-surface">
              <h4>When</h4>
              <torlify-auto-textarea .value="${this.chapterContext.chapter.when}" @input="${this.updateProperty("when")}"></torlify-auto-textarea>
              <h4>Where</h4>
              <torlify-auto-textarea .value="${this.chapterContext.chapter.where}" @input="${this.updateProperty("where")}"></torlify-auto-textarea>
              <h4>What</h4>
              <torlify-auto-textarea .value="${this.chapterContext.chapter.what}" @input="${this.updateProperty("what")}"></torlify-auto-textarea>
              <h4>Why</h4>
              <torlify-auto-textarea .value="${this.chapterContext.chapter.why}" @input="${this.updateProperty("why")}"></torlify-auto-textarea>
              <h4>How</h4>
              <torlify-auto-textarea .value="${this.chapterContext.chapter.how}" @input="${this.updateProperty("how")}"></torlify-auto-textarea>
              <h4>Who</h4>
              <torlify-auto-textarea .value="${this.chapterContext.chapter.who}" @input="${this.updateProperty("who")}"></torlify-auto-textarea>
            </div>
            <div class="secondary-surface">
              <h4>Minimum Parts</h4>
              <input type="text" .value="${this.chapterContext.chapter.minParts}" @input="${this.updateProperty("minParts")}"></input>
              <h4>Maximum Parts</h4>
              <input type="text" .value="${this.chapterContext.chapter.maxParts}" @input="${this.updateProperty("maxParts")}"></input>
              <h4>Estimated Part Length in Words</h4>
              <input type="text" .value="${this.chapterContext.chapter.partLength}" @input="${this.updateProperty("partLength")}"></input>
            </div>
            <torlify-bar>
              <button @click=${(): void => dispatch(this, WarningEvent("Not implemented"))} class="standard-button">Generate Outline</button>
              <button @click=${(): void => dispatch(this, WarningEvent("Not implemented"))} class="standard-button">Generate Chapter</button>
              <button @click=${(): void => dispatch(this, WarningEvent("Not implemented"))} class="standard-button">Generate Audio</button>
              <button @click=${(): void => dispatch(this, WarningEvent("Not implemented"))} class="standard-button">Generate Everything</button>
            </torlify-bar>
            <div class="secondary-surface">
              <h4>Outline</h4>
              ${this.chapterContext.chapter.outline.map(
                (item, index) => html`
                  <torlify-auto-textarea
                    .value="${item}"
                    @input="${this.updateProperty("outline", index)}"
                  ></torlify-auto-textarea>
                `,
              )}
            </div>
          `
        : html`<p>Loading chapter...</p>`}
    `;
  }

  updateProperty(
    property: keyof Chapter,
    index?: number,
  ): (event: CustomEvent | InputEvent) => void {
    return (event: CustomEvent | InputEvent): void => {
      const isAutoTextarea =
        (event.target as HTMLElement).tagName.toLocaleLowerCase() ===
        AUTO_TEXTAREA_TAG_NAME;
      const value = isAutoTextarea
        ? (event as CustomEvent).detail.value
        : (event.target as HTMLInputElement).value;
      if (value === undefined) return;
      const chapter = this.chapterContext.chapter!;
      if (!chapter) return;
      if (
        property === "minParts" ||
        property === "maxParts" ||
        property === "partLength"
      ) {
        chapter[property] = Number(value);
      } else if (
        property === "how" ||
        property === "who" ||
        property === "what" ||
        property === "when" ||
        property === "where" ||
        property === "why" ||
        property === "title"
      ) {
        chapter[property] = value;
      } else if (property === "outline") {
        chapter.outline[index!] = value;
      } else {
        throw new Error(`Unknown property: ${property}`);
      }
      this.save();
    };
  }

  save(): void {
    this.debounceHandler.debounce(async () => {
      updateChapterService.fetch({
        book: this.bookId,
        chapter: this.chapterContext.chapter,
      });
      dispatch(this, SaveEvent());
    });
  }

  get bookId(): BookId {
    const bookId = this.bookContext.book?.id;
    if (!bookId) throw new Error("Book ID is not available");
    return bookId;
  }
}
