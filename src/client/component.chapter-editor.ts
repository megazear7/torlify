import { consume } from "@lit/context";
import { css, html, LitElement, TemplateResult } from "lit";
import { customElement, property, query } from "lit/decorators.js";
import { BookContext, bookContext, chapterContext, ChapterContext, PartContext, partContext } from "./context.js";
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
import { TorlifyModal } from "./component.modal.js";
import { aiIcon, leftArrowIcon, replaceIcon, rightArrowIcon } from "./icons.js";
import { generatePartAudioService } from "../shared/service.generate-part-audio.js";
import { createOutlineForChapter } from "../shared/util.book.js";
import { downloadTextFile } from "./util.download.js";
import { downloadChapterService } from "../shared/service.download-chapter.js";
import { handleError } from "./util.error.js";
import { downloadChapterAudioService } from "../shared/service.download-chapter-audio.js";
import { Step, StepStatus, TorlifyLoadingOverlay } from "./component.loading-overlay.js";
import { NavigationEvent } from "./event.navigation.js";
import "./component.chapter-title-modal.js";
import "./component.auto-textarea.js";
import "./component.bar.js";

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

      .title {
        display: flex;
        align-items: center;
      }

      torlify-chapter-title-modal {
        margin-left: auto;
      }

      .nav-container {
        position: fixed;
        bottom: var(--size-large);
        display: flex;
        align-items: center;
        gap: var(--size-small);
      }

      .nav-container-previous {
        left: var(--size-large);
      }

      .nav-container-next {
        right: var(--size-large);
      }

      .nav-button {
        width: var(--size-xl);
        height: var(--size-xl);
        border-radius: 50%;
        border: none;
        background-color: var(--color-secondary-surface);
        color: var(--color-primary-text-muted);
        font-size: var(--font-large);
        cursor: pointer;
        box-shadow: var(--shadow-normal);
        z-index: 1000;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s ease;
      }

      .nav-button:hover:not(:disabled) {
        background-color: var(--color-2);
        transform: scale(1.1);
      }

      .nav-button:disabled {
        cursor: not-allowed;
        opacity: 0.5;
      }

      .nav-button.previous {
        left: var(--size-xl);
      }

      .nav-button.next {
        right: var(--size-xl);
      }

      .part-nav-button {
        width: var(--size-large);
        height: var(--size-large);
        border-radius: 50%;
        border: none;
        background-color: var(--color-secondary-surface);
        color: var(--color-primary-text-muted);
        font-size: var(--font-large);
        cursor: pointer;
        box-shadow: var(--shadow-normal);
        z-index: 1000;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s ease;
      }

      .part-nav-button:hover:not(:disabled) {
        background-color: var(--color-2);
        transform: scale(1.1);
      }

      .part-nav-button:disabled {
        cursor: not-allowed;
        opacity: 0.5;
      }

      .part-nav-button.previous {
        left: calc(var(--size-xl) + calc(var(--size-xl) * 1.5) + var(--size-medium));
      }

      .part-nav-button.next {
        right: calc(var(--size-xl) + var(--size-large) + var(--size-medium));
      }

      .delete-options {
        display: flex;
      }

      .delete-options :nth-child(2) {
        margin-left: auto;
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

  @consume({ context: partContext, subscribe: true })
  @property({ attribute: false })
  public partContext: PartContext = {
    status: LoadingStatus.enum.idle,
  };

  @property({ type: String })
  loading: boolean = false;

  @property({ type: String })
  public loadingMessage: string = "Loading";

  @property({ type: Boolean })
  public regenerateChecked: boolean = false;

  @property({ type: Boolean })
  private downloadingAudio: boolean = false;

  @property({ type: Array, attribute: false })
  public steps: Step[] = [];

  @query("torlify-loading-overlay")
  private loadingOverlay!: TorlifyLoadingOverlay;

  private debounceHandler = new DebounceHandler();

  override render(): TemplateResult {
    return html`
      ${this.chapterContext.chapter
        ? html`
            <torlify-loading-overlay
              .visible="${this.loading}"
              message="${this.loadingMessage}"
              .steps="${this.steps}"></torlify-loading-overlay>
            <div class="secondary-surface">
              <h4 class="title">
                Chapter ${this.chapterContext.chapter.number}
                <torlify-chapter-title-modal></torlify-chapter-title-modal>
              </h4>
              <torlify-field property="chapter.title" type="textarea" heading="h2"></torlify-field>
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
                ${this.regenerateChecked
                  ? html`
                      <p>All content for the entire chapter will be generated, replacing any existing content.</p>
                    `
                  : html`
                      <p>
                        All missing content will be generated for the entire chapter but no existing content will be
                        replaced.
                      </p>
                    `}
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
                  <button class="standard-button" @click="${this.downloadOutline()}">Outline</button>
                  <button class="standard-button" @click="${this.downloadText()}">Text</button>
                  <button class="standard-button" @click="${this.downloadAudio()}">
                    Audio
                    ${this.downloadingAudio
                      ? html`
                          <torlify-spinner></torlify-spinner>
                        `
                      : ""}
                  </button>
                </torlify-bar>
              </div>
            </torlify-modal>
            <torlify-modal id="${Modal.enum.move}-modal">
              <div slot="body">
                <h3>Move Chapter</h3>
                <p>Move this chapter before the previous chapter or after the next chapter?</p>
                <torlify-bar>
                  <button class="standard-button" @click="${this.notImplemented(Modal.enum.move)}">
                    Before previous
                  </button>
                  <button class="standard-button" @click="${this.notImplemented(Modal.enum.move)}">After next</button>
                </torlify-bar>
              </div>
            </torlify-modal>
            <torlify-modal id="${Modal.enum.add}-modal">
              <div slot="body">
                <h3>Add Chapter</h3>
                <p>Add a new chapter before the previous chapter or after the next chapter?</p>
                <torlify-bar>
                  <button class="standard-button" @click="${this.notImplemented(Modal.enum.add)}">
                    Before previous
                  </button>
                  <button class="standard-button" @click="${this.notImplemented(Modal.enum.add)}">After next</button>
                </torlify-bar>
              </div>
            </torlify-modal>
            <torlify-modal id="${Modal.enum.delete}-modal">
              <div slot="body">
                <h3>Delete Chapter</h3>
                <p>Are you sure you want to delete this chapter?</p>
                <div class="delete-options">
                  <torlify-bar>
                    <button class="standard-button" @click="${this.notImplemented(Modal.enum.delete)}">Outline</button>
                    <button class="standard-button" @click=${this.notImplemented(Modal.enum.delete)}>Text</button>
                    <button class="standard-button" @click=${this.notImplemented(Modal.enum.delete)}>Audio</button>
                  </torlify-bar>
                  <torlify-bar>
                    <button class="standard-button delete" @click="${this.notImplemented(Modal.enum.delete)}">
                      Delete
                    </button>
                  </torlify-bar>
                </div>
              </div>
            </torlify-modal>
            <div class="secondary-surface">
              <torlify-field property="chapter.when"></torlify-field>
              <torlify-field property="chapter.where"></torlify-field>
              <torlify-field property="chapter.what"></torlify-field>
              <torlify-field property="chapter.why"></torlify-field>
              <torlify-field property="chapter.how"></torlify-field>
              <torlify-field property="chapter.who"></torlify-field>
            </div>
            <div class="secondary-surface">
              <torlify-field property="chapter.minParts"></torlify-field>
              <torlify-field property="chapter.maxParts"></torlify-field>
              <torlify-field property="chapter.partLength"></torlify-field>
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
      <div class="nav-container nav-container-previous">
        <button
          class="part-nav-button previous"
          @click="${this.navigateToPreviousPart}"
          ?disabled="${!this.hasPreviousPart}"
          title="${this.hasPreviousPart ? "Go to previous part" : "No previous part"}">
          ${leftArrowIcon}
        </button>
        <button
          class="nav-button previous"
          @click="${this.navigateToPreviousChapter}"
          ?disabled="${!this.hasPrevious}"
          title="${this.hasPrevious ? "Go to previous chapter" : "No previous chapter"}">
          ${leftArrowIcon}
        </button>
      </div>
      <div class="nav-container nav-container-next">
        <button
          class="nav-button next"
          @click="${this.navigateToNextChapter}"
          ?disabled="${!this.hasNext}"
          title="${this.hasNext ? "Go to next chapter" : "No next chapter"}">
          ${rightArrowIcon}
        </button>
        <button
          class="part-nav-button next"
          @click="${this.navigateToNextPart}"
          ?disabled="${!this.hasNextPart}"
          title="${this.hasNextPart ? "Go to next part" : "No next part"}">
          ${rightArrowIcon}
        </button>
      </div>
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
      this.closeModal(Modal.enum.generate)();
      this.loading = true;
      this.loadingMessage = "Generating chapter outline";
      this.steps = [
        {
          status: StepStatus.enum.progress,
          message: "Generate outline",
        },
      ];
      this.loadingOverlay.requestUpdate();
      try {
        this.chapterContext.chapter = await generateChapterOutlineService.fetch({
          book,
          chapter: String(chapter.number),
        });
        this.steps[0].status = StepStatus.enum.done;
        this.loadingOverlay.requestUpdate();
      } catch {
        dispatch(this, WarningEvent("Failed to generate outline"));
      }
      this.loading = false;
      this.steps = [];
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
      this.closeModal(Modal.enum.generate)();
      this.loading = true;
      this.loadingMessage = "Generating chapter parts";
      const steps: Step[] = [];
      for (const part of chapter.parts || []) {
        steps.push({
          status: StepStatus.enum.pending,
          message: `Generate text for part ${part.number}`,
        });
      }
      this.steps = steps;
      for (const step of this.steps) {
        step.status = StepStatus.enum.progress;
        this.loadingOverlay.requestUpdate();
        const partIndex = this.steps.indexOf(step);
        const part = chapter.parts[partIndex];
        await this.generateTextForChapterPart(this.regenerateChecked, book, chapter, part);
        step.status = StepStatus.enum.done;
        this.loadingOverlay.requestUpdate();
      }
      this.loading = false;
      this.steps = [];
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
      this.closeModal(Modal.enum.generate)();
      this.loading = true;
      this.loadingMessage = `Generating audio for chapter ${chapter.number} with the ${book.model.audio.voice} voice`;
      const steps: Step[] = [];
      for (const part of chapter.parts) {
        steps.push({
          status: StepStatus.enum.pending,
          message: `Generate audio for part ${part.number}`,
        });
      }
      this.steps = steps;
      for (const step of this.steps) {
        step.status = StepStatus.enum.progress;
        this.loadingOverlay.requestUpdate();
        const partIndex = this.steps.indexOf(step);
        const part = chapter.parts[partIndex];
        await this.generateAudioForChapterPart(this.regenerateChecked, book, chapter, part);
        step.status = StepStatus.enum.done;
        this.loadingOverlay.requestUpdate();
      }
      this.loading = false;
      this.steps = [];
    };
  }

  downloadOutline() {
    return (): void => {
      const text = createOutlineForChapter(this.chapterContext.chapter!);
      downloadTextFile(
        text,
        `${this.bookContext.book?.title || "book"} Chapter ${this.chapterContext.chapter?.number || 1} Outline.md`,
      );
      this.closeModal(Modal.enum.download)();
    };
  }

  downloadText() {
    return async (): Promise<void> => {
      try {
        await downloadChapterService.fetch({
          book: this.bookContext.book!.id,
          chapter: String(this.chapterContext.chapter!.number),
        });
      } catch (error) {
        handleError(this, error, "Failed to download chapter text");
        return;
      }
      this.closeModal(Modal.enum.download)();
    };
  }

  downloadAudio(): () => void {
    return async (): Promise<void> => {
      try {
        this.downloadingAudio = true;
        await downloadChapterAudioService.fetch({
          book: this.bookContext.book!.id,
          chapter: String(this.chapterContext.chapter!.number),
        });
        this.downloadingAudio = false;
      } catch (error) {
        handleError(this, error, "Failed to download chapter audio");
      } finally {
        this.closeModal(Modal.enum.download)();
      }
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

  get hasPrevious(): boolean {
    const chapters = this.bookContext.book?.chapters;
    const currentChapter = this.chapterContext.chapter;
    if (!chapters || !currentChapter) return false;
    const currentIndex = chapters.findIndex((ch) => ch.number === currentChapter.number);
    return currentIndex > 0;
  }

  get hasNext(): boolean {
    const chapters = this.bookContext.book?.chapters;
    const currentChapter = this.chapterContext.chapter;
    if (!chapters || !currentChapter) return false;
    const currentIndex = chapters.findIndex((ch) => ch.number === currentChapter.number);
    return currentIndex < chapters.length - 1;
  }

  get hasPreviousPart(): boolean {
    const chapter = this.chapterContext.chapter;
    const part = this.partContext.part;
    if (!chapter || !part) return false;
    if (part.number > 1) return true;
    // Check if there's a previous chapter
    const chapters = this.bookContext.book?.chapters;
    if (!chapters) return false;
    const currentChapterIndex = chapters.findIndex((ch) => ch.number === chapter.number);
    return currentChapterIndex > 0;
  }

  get hasNextPart(): boolean {
    const chapter = this.chapterContext.chapter;
    const part = this.partContext.part;
    if (!chapter || !part) return false;
    if (part.number < chapter.parts.length) return true;
    // Check if there's a next chapter
    const chapters = this.bookContext.book?.chapters;
    if (!chapters) return false;
    const currentChapterIndex = chapters.findIndex((ch) => ch.number === chapter.number);
    return currentChapterIndex < chapters.length - 1;
  }

  navigateToPreviousChapter(): void {
    if (!this.hasPrevious) return;
    const chapters = this.bookContext.book!.chapters;
    const currentChapter = this.chapterContext.chapter!;
    const currentIndex = chapters.findIndex((ch) => ch.number === currentChapter.number);
    const previousChapter = chapters[currentIndex - 1];
    dispatch(this, NavigationEvent({ path: `/book/${this.bookId}/chapter/${previousChapter.number}` }));
  }

  navigateToNextChapter(): void {
    if (!this.hasNext) return;
    const chapters = this.bookContext.book!.chapters;
    const currentChapter = this.chapterContext.chapter!;
    const currentIndex = chapters.findIndex((ch) => ch.number === currentChapter.number);
    const nextChapter = chapters[currentIndex + 1];
    dispatch(this, NavigationEvent({ path: `/book/${this.bookId}/chapter/${nextChapter.number}` }));
  }

  navigateToPreviousPart(): void {
    if (!this.hasPreviousPart) return;
    const book = this.bookContext.book!;
    const chapter = this.chapterContext.chapter!;
    const part = this.partContext.part!;
    const chapters = book.chapters;
    const currentChapterIndex = chapters.findIndex((ch) => ch.number === chapter.number);

    if (part.number > 1) {
      // Previous part in same chapter
      const prevPartNumber = part.number - 1;
      dispatch(this, NavigationEvent({ path: `/book/${book.id}/chapter/${chapter.number}/part/${prevPartNumber}` }));
    } else {
      // Last part of previous chapter
      const prevChapter = chapters[currentChapterIndex - 1];
      const lastPartNumber = prevChapter.parts.length;
      dispatch(
        this,
        NavigationEvent({ path: `/book/${book.id}/chapter/${prevChapter.number}/part/${lastPartNumber}` }),
      );
    }
  }

  navigateToNextPart(): void {
    if (!this.hasNextPart) return;
    const book = this.bookContext.book!;
    const chapter = this.chapterContext.chapter!;
    const part = this.partContext.part!;
    const chapters = book.chapters;
    const currentChapterIndex = chapters.findIndex((ch) => ch.number === chapter.number);

    if (part.number < chapter.parts.length) {
      // Next part in same chapter
      const nextPartNumber = part.number + 1;
      dispatch(this, NavigationEvent({ path: `/book/${book.id}/chapter/${chapter.number}/part/${nextPartNumber}` }));
    } else {
      // First part of next chapter
      const nextChapter = chapters[currentChapterIndex + 1];
      dispatch(this, NavigationEvent({ path: `/book/${book.id}/chapter/${nextChapter.number}/part/1` }));
    }
  }
}
