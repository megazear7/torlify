import { consume } from "@lit/context";
import { css, html, LitElement, TemplateResult } from "lit";
import { customElement, property } from "lit/decorators.js";
import { BookContext, bookContext, chapterContext, ChapterContext } from "./context.book.js";
import { LoadingStatus } from "../shared/type.loading.js";
import { globalStyles } from "./styles.global.js";
import { dispatch } from "./util.events.js";
import { WarningEvent } from "./event.warning.js";
import { DebounceHandler } from "./util.debounce.js";
import { SaveEvent } from "./event.save.js";
import { updateChapterService } from "../shared/service.update-chapter.js";
import { Book, BookId, Chapter, ChapterPart } from "../shared/type.book.js";
import { AUTO_TEXTAREA_TAG_NAME } from "./component.auto-textarea.js";
import { generatePartService } from "../shared/service.generate-part.js";
import { generateChapterOutlineService } from "../shared/service.generate-chapter-outline.js";
import z from "zod";
import "./component.auto-textarea.js";
import "./component.bar.js";
import { TorlifyModal } from "./component.modal.js";
import { aiIcon, replaceIcon } from "./icons.js";
import { generatePartAudioService } from "../shared/service.generate-part-audio.js";

export const Modal = z.enum(["generate", "edit", "download", "move", "add", "delete"]);
export type Modal = z.infer<typeof Modal>;

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

  @property({ type: String })
  loading: boolean = false;

  @property({ type: String })
  public loadingMessage: string = "Loading";

  @property({ type: Boolean })
  public regenerateChecked: boolean = false;

  private debounceHandler = new DebounceHandler();

  override render(): TemplateResult {
    return html`
      ${this.chapterContext.chapter
        ? html`
            <torlify-loading-overlay
              .visible="${this.loading}"
              message="${this.loadingMessage}"
            ></torlify-loading-overlay>
            <div class="secondary-surface">
              <h4>Chapter ${this.chapterContext.chapter.number}</h4>
              <torlify-auto-textarea
                heading="h2"
                .value="${this.chapterContext.chapter.title}"
                @input="${this.updateProperty("title")}"
              ></torlify-auto-textarea>
            </div>
            <torlify-bar>
              <button class="standard-button" @click=${this.openModal(Modal.enum.generate)}>Generate</button>
              <button class="standard-button" @click=${this.openModal(Modal.enum.edit)}>Edit</button>
              <button class="standard-button" @click=${this.openModal(Modal.enum.download)}>Download</button>
            </torlify-bar>
            <torlify-bar>
              <button class="standard-button" @click=${this.openModal(Modal.enum.move)}>Move</button>
              <button class="standard-button" @click=${this.openModal(Modal.enum.add)}>Add</button>
              <button class="standard-button" @click=${this.openModal(Modal.enum.delete)}>Delete</button>
            </torlify-bar>
            <torlify-modal id="${Modal.enum.generate}-modal">
              <div slot="body">
                <h3>Generate Chapter</h3>
                <torlify-checkbox
                  off="Generate Missing Content"
                  on="Regenerate All Content"
                  .offIcon="${aiIcon}"
                  .onIcon="${replaceIcon}"
                  .checked="${this.regenerateChecked}"
                  @change="${this.handleRegenerateCheckedChange}"></torlify-checkbox>
                ${
                  this.regenerateChecked
                    ? html`
                        <p>All content for the entire chapter will be generated, replacing any existing content.</p>
                      `
                    : html`
                        <p>
                          All missing content will be generated for the entire chapter but no existing content will be
                          replaced.
                        </p>
                      `
                }
                <torlify-bar>
                  <button class="standard-button" @click="${this.generateOutline()}">Outline</button>
                  <button class="standard-button" @click="${this.generateParts()}">Text</button>
                  <button class="standard-button" @click="${this.generateAudio()}">Audio</button>
                </torlify-bar>
              </div>
            </torlify-modal>
            <torlify-modal id="${Modal.enum.edit}-modal">
              <div slot="body">
                <h3>Edit Chapter</h3>
                <p>Edit the entire chapter based on your instructions</p>
                <torlify-bar>
                  <button class="standard-button" @click="${this.notImplemented(Modal.enum.edit)}">Edit</button>
                </torlify-bar>
              </div>
            </torlify-modal>
            <torlify-modal id="${Modal.enum.download}-modal">
              <div slot="body">
                <h3>Download Chapter</h3>
                <p>Download the complete chapter outline, text, or audio.</p>
                <torlify-bar>
                  <button class="standard-button" @click="${this.notImplemented(Modal.enum.download)}">Outline</button>
                  <button class="standard-button" @click="${this.notImplemented(Modal.enum.download)}">Text</button>
                  <button class="standard-button" @click="${this.notImplemented(Modal.enum.download)}">Audio</button>
                </torlify-bar>
              </div>
            </torlify-modal>
            <torlify-modal id="${Modal.enum.move}-modal">
              <div slot="body">
                <h3>Move Chapter</h3>
                <p>Move this chapter before the previous chapter or after the next chapter?</p>
                <torlify-bar>
                  <button class="standard-button" @click="${this.notImplemented(Modal.enum.move)}">Before previous</button>
                  <button class="standard-button" @click="${this.notImplemented(Modal.enum.move)}">After next</button>
                </torlify-bar>
              </div>
            </torlify-modal>
            <torlify-modal id="${Modal.enum.add}-modal">
              <div slot="body">
                <h3>Add Chapter</h3>
                <p>Add a new chapter before the previous chapter or after the next chapter?</p>
                <torlify-bar>
                  <button class="standard-button" @click="${this.notImplemented(Modal.enum.add)}">Before previous</button>
                  <button class="standard-button" @click="${this.notImplemented(Modal.enum.add)}">After next</button>
                </torlify-bar>
              </div>
            </torlify-modal>
            <torlify-modal id="${Modal.enum.delete}-modal">
              <div slot="body">
                <h3>Delete Chapter</h3>
                <p>Are you sure you want to delete this chapter?</p>
                <torlify-bar>
                  <button class="standard-button" @click="${this.notImplemented(Modal.enum.delete)}">Delete</button>
                  <button class="standard-button" @click="${this.closeModal(Modal.enum.delete)}">Cancel</button>
                </torlify-bar>
              </div>
            </torlify-modal>
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
            <div class="secondary-surface">
              <h4>Outline</h4>
              ${this.chapterContext.chapter.outline.map(
                (item, index) => html`
                  <torlify-auto-textarea
                    .value="${item}"
                    @input="${this.updateProperty("outline", index)}"></torlify-auto-textarea>
                `,
              )}
            </div>
          `
        : html`
            <p>Loading chapter...</p>
          `}
    `;
  }

  handleRegenerateCheckedChange(e: Event): void {
    const target = e.target as HTMLInputElement;
    this.regenerateChecked = target.checked;
  }

  openModal(name: Modal): () => void {
    return (): void => {
      const modal = this.shadowRoot?.querySelector(`#${name}-modal`) as TorlifyModal;
      modal.open();
    };
  }

  closeModal(name: Modal): () => void {
    return (): void => {
      const modal = this.shadowRoot?.querySelector(`#${name}-modal`) as TorlifyModal;
      modal.close();
    };
  }

  notImplemented(name: Modal): () => void {
    return (): void => {
      this.closeModal(name)();
      dispatch(this, WarningEvent("This feature is not implemented yet"));
    };
  }

  generateOutline() {
    return async (): Promise<void> => {
      const book = this.bookContext.book?.id;
      const chapter = this.chapterContext.chapter;
      if (!book || !chapter) {
        dispatch(this, WarningEvent("Book or chapter not loaded"));
        return;
      }
      const allOutlineGenerated = chapter.outline.every((item) => item && item.trim() !== "");
      if (!this.regenerateChecked && allOutlineGenerated) {
        dispatch(this, WarningEvent("Chapter outline is already generated"));
        return;
      }
      this.loading = true;
      this.loadingMessage = "Generating chapter outline";
      try {
        this.chapterContext.chapter = await generateChapterOutlineService.fetch({
          book,
          chapter: String(chapter.number),
        });
      } catch {
        dispatch(this, WarningEvent("Failed to generate outline"));
      }
      this.loading = false;
    };
  }

  generateParts() {
    return async (): Promise<void> => {
      const book = this.bookContext.book;
      const chapter = this.chapterContext.chapter;
      if (!book || !chapter) {
        dispatch(this, WarningEvent("Book or chapter not loaded"));
        return;
      }
      const allPartsGenerated = chapter.parts.every((part) => part.text && part.text.trim() !== "") ?? false;
      if (!this.regenerateChecked && allPartsGenerated) {
        dispatch(this, WarningEvent("All chapter parts are already generated"));
        return;
      }
      const hasIncompleteOutline = chapter.outline.some((item) => !item || item.trim() === "");
      if (hasIncompleteOutline) {
        dispatch(this, WarningEvent("Chapter outline must be complete before generating parts"));
        return;
      }
      this.loading = true;
      this.loadingMessage = "Generating chapter parts";
      for (const part of chapter.parts || []) {
        await this.generateTextForChapterPart(this.regenerateChecked, book, chapter, part);
      }
      this.loading = false;
    };
  }

  generateAudio() {
    return async (): Promise<void> => {
      const book = this.bookContext.book;
      const chapter = this.chapterContext.chapter;
      if (!book || !chapter) {
        dispatch(this, WarningEvent("Book or chapter not loaded"));
        return;
      }
      const hasNoTextParts = chapter.parts.some((part) => !part.text || part.text.trim() === "");
      if (hasNoTextParts) {
        dispatch(this, WarningEvent("All chapter parts must have text before generating audio"));
        return;
      }
      const hasAllAudioParts = chapter.parts.every((part) => !!part.audio);
      if (!this.regenerateChecked && hasAllAudioParts) {
        dispatch(this, WarningEvent("All chapter parts already have audio"));
        return;
      }
      if (!book.model.audio.voice) {
        dispatch(this, WarningEvent("No audio voice selected. Please update this configuration."));
        return;
      }
      this.loading = true;
      this.loadingMessage = `Generating audio for chapter ${chapter.number} with the ${book.model.audio.voice} voice`;
      for (const part of chapter.parts) {
        await this.generateAudioForChapterPart(this.regenerateChecked, book, chapter, part);
      }
      this.loading = false;
    };
  }

  async generateTextForChapterPart(
    regenerate: boolean,
    book: Book,
    chapter: Chapter,
    part: ChapterPart,
  ): Promise<void> {
    const hasText = !!part.text && part.text.trim() !== "";
    if (!regenerate && hasText) {
      return;
    }
    this.loadingMessage = `Generating part ${part.number} of chapter ${chapter.number}`;
    try {
      this.chapterContext.chapter!.parts[part.number - 1] = await generatePartService.fetch({
        book: book.id,
        chapter: String(chapter.number),
        part: String(part.number),
      });
    } catch {
      dispatch(this, WarningEvent("Failed to generate part"));
    }
  }

  async generateAudioForChapterPart(
    regenerate: boolean,
    book: Book,
    chapter: Chapter,
    part: ChapterPart,
  ): Promise<void> {
    const hasAudio = !!part.audio;
    if (!regenerate && hasAudio) {
      return;
    }
    this.loadingMessage = `Generating audio for part ${part.number} of chapter ${chapter.number} with the ${book.model.audio.voice} voice `;
    try {
      await generatePartAudioService.fetch({
        book: book.id,
        chapter: String(chapter.number),
        part: String(part.number),
      });
    } catch {
      dispatch(this, WarningEvent("Failed to generate audio"));
    }
  }

  updateProperty(property: keyof Chapter, index?: number): (event: CustomEvent | InputEvent) => void {
    return (event: CustomEvent | InputEvent): void => {
      const isAutoTextarea = (event.target as HTMLElement).tagName.toLocaleLowerCase() === AUTO_TEXTAREA_TAG_NAME;
      const value = isAutoTextarea ? (event as CustomEvent).detail.value : (event.target as HTMLInputElement).value;
      if (value === undefined) return;
      const chapter = this.chapterContext.chapter!;
      if (!chapter) return;
      if (property === "minParts" || property === "maxParts" || property === "partLength") {
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
