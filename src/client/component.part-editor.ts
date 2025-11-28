import { consume } from "@lit/context";
import { html, LitElement, TemplateResult } from "lit";
import { customElement, property } from "lit/decorators.js";
import {
  bookContext,
  BookContext,
  ChapterContext,
  chapterContext,
  PartContext,
  partContext,
} from "./context.book.js";
import { LoadingStatus } from "../shared/type.loading.js";
import { globalStyles } from "./styles.global.js";
import { WarningEvent } from "./event.warning.js";
import { dispatch } from "./util.events.js";
import { updatePartService } from "../shared/service.update-part.js";
import { updateChapterService } from "../shared/service.update-chapter.js";
import { DebounceHandler } from "./util.debounce.js";
import "./component.auto-textarea.js";
import "./component.bar.js";
import { SaveEvent } from "./event.save.js";
import { NavigationEvent } from "./event.navigation.js";
import { generatePartService } from "../shared/service.generate-part.js";

@customElement("torlify-part-editor")
export class TorlifyPartEditor extends LitElement {
  static override styles = [globalStyles];

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

  @property({ type: String })
  loading: boolean = false;

  private debounceHandler = new DebounceHandler();

  override render(): TemplateResult {
    return html`
      ${this.partContext.part
        ? html`
            <torlify-loading-overlay
              .visible="${this.loading}"
            ></torlify-loading-overlay>
            <torlify-bar>
              <button @click=${this.generateText()} class="standard-button">
                ${this.msgText}
              </button>
              <button
                @click=${(): void =>
                  dispatch(this, WarningEvent("Not implemented"))}
                class="standard-button"
              >
                Edit Part
              </button>
              <button
                @click=${(): void =>
                  dispatch(this, WarningEvent("Not implemented"))}
                class="standard-button"
              >
                ${this.msgAudio}
              </button>
              <button @click=${this.removePart()} class="standard-button">
                Remove Part
              </button>
              <button @click=${this.addPart()} class="standard-button">
                Add Part
              </button>
            </torlify-bar>
            <div class="secondary-surface">
              <torlify-auto-textarea
                .value="${this.partContext.part.text}"
                @input=${this.handleTextChange()}
              ></torlify-auto-textarea>
            </div>
          `
        : html`<p>Loading part...</p>`}
    `;
  }

  generateText(): () => void {
    return async (): Promise<void> => {
      this.loading = true;
      const book = this.bookContext.book?.id;
      const chapter = String(this.chapterContext.chapter?.number);
      const part = String(this.partContext.part?.number);
      if (!book || !chapter || !part) {
        dispatch(this, WarningEvent("Book, chapter, or part not loaded"));
        this.loading = false;
        return;
      }
      try {
        const newPart = await generatePartService.fetch({
          book,
          chapter,
          part,
        });
        this.partContext.part = newPart;
      } catch {
        dispatch(this, WarningEvent("Failed to generate part"));
      }
      this.loading = false;
    };
  }

  handleTextChange(): (event: CustomEvent) => void {
    return (event: CustomEvent): void => {
      if (event.detail.value === undefined) return;
      this.partContext.part!.text = event.detail.value;
      this.debounceHandler.debounce(() => {
        const book = this.bookContext.book;
        const chapter = this.chapterContext.chapter;
        const part = this.partContext.part;
        if (!book || !chapter || !part) {
          dispatch(this, WarningEvent("Book, chapter, or part not loaded"));
          return;
        }
        updatePartService.fetch({
          book: book.id,
          chapter: String(chapter.number),
          part: part,
        });
        dispatch(this, SaveEvent());
      });
    };
  }

  removePart(): () => void {
    return async (): Promise<void> => {
      const book = this.bookContext.book;
      const chapter = this.chapterContext.chapter;
      const part = this.partContext.part;

      if (!book || !chapter || !part) {
        dispatch(this, WarningEvent("Book, chapter, or part not loaded"));
        return;
      }

      const partIndex = chapter.parts.findIndex(
        (p) => p.number === part.number,
      );
      if (partIndex === -1) {
        dispatch(this, WarningEvent("Part not found in chapter"));
        return;
      }

      // Remove the part
      chapter.parts.splice(partIndex, 1);

      // Also remove the corresponding outline entry
      if (chapter.outline && chapter.outline.length > partIndex) {
        chapter.outline.splice(partIndex, 1);
      }

      // Renumber remaining parts
      chapter.parts.forEach((p, index) => {
        p.number = index + 1;
      });

      try {
        await updateChapterService.fetch({
          book: book.id,
          chapter: chapter,
        });
        dispatch(this, SaveEvent());

        // Navigate to appropriate part
        const newPartNumber = partIndex > 0 ? partIndex : 1;
        const targetPart = chapter.parts.find(
          (p) => p.number === newPartNumber,
        );

        if (targetPart) {
          dispatch(
            this,
            NavigationEvent({
              path: `/book/${book.id}/chapter/${chapter.number}/part/${targetPart.number}`,
            }),
          );
        } else {
          // No parts left, navigate to chapter
          dispatch(
            this,
            NavigationEvent({
              path: `/book/${book.id}/chapter/${chapter.number}`,
            }),
          );
        }
      } catch {
        dispatch(this, WarningEvent("Failed to remove part"));
      }
    };
  }

  addPart(): () => void {
    return async (): Promise<void> => {
      const book = this.bookContext.book;
      const chapter = this.chapterContext.chapter;
      const part = this.partContext.part;

      if (!book || !chapter || !part) {
        dispatch(this, WarningEvent("Book, chapter, or part not loaded"));
        return;
      }

      const partIndex = chapter.parts.findIndex(
        (p) => p.number === part.number,
      );
      if (partIndex === -1) {
        dispatch(this, WarningEvent("Part not found in chapter"));
        return;
      }

      // Create new empty part
      const newPart = {
        number: partIndex + 2, // Will be renumbered
        text: "",
        audio: undefined,
      };

      // Insert after current part
      chapter.parts.splice(partIndex + 1, 0, newPart);

      // Also insert an empty outline entry at the same position
      if (chapter.outline) {
        chapter.outline.splice(partIndex + 1, 0, "");
      }

      // Renumber all parts
      chapter.parts.forEach((p, index) => {
        p.number = index + 1;
      });

      try {
        await updateChapterService.fetch({
          book: book.id,
          chapter: chapter,
        });
        dispatch(this, SaveEvent());

        // Navigate to the new part
        dispatch(
          this,
          NavigationEvent({
            path: `/book/${book.id}/chapter/${chapter.number}/part/${newPart.number}`,
          }),
        );
      } catch {
        dispatch(this, WarningEvent("Failed to add part"));
      }
    };
  }

  get msgText(): string {
    return this.hasText ? "Regenerate Part" : "Generate Part";
  }

  get msgAudio(): string {
    return this.hasAudio ? "Regenerate Audio" : "Generate Audio";
  }

  get hasText(): boolean {
    return !!this.partContext.part?.text;
  }

  get hasAudio(): boolean {
    return !!this.partContext.part?.audio;
  }
}
