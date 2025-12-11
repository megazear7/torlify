import { consume } from "@lit/context";
import { css, html, LitElement, TemplateResult } from "lit";
import { customElement, property } from "lit/decorators.js";
import { BookContext, bookContext } from "./context.js";
import { LoadingStatus } from "../shared/type.loading.js";
import { globalStyles } from "./styles.global.js";
import { checkCompletion, formatDate, formatNumber } from "../shared/util.number.js";
import { dispatch } from "./util.events.js";
import { WarningEvent } from "./event.warning.js";
import { downloadBookService } from "../shared/service.download-book.js";
import { TorlifyModal } from "./component.modal.js";
import { deleteBookService } from "../shared/service.delete-book.js";
import { NavigationEvent } from "./event.navigation.js";
import { generateChapterOutlineService } from "../shared/service.generate-chapter-outline.js";
import { generatePartService } from "../shared/service.generate-part.js";
import z from "zod";
import { Chapter, ChapterPart } from "../shared/type.book.js";
import { generatePartAudioService } from "../shared/service.generate-part-audio.js";
import { downloadBookAudioService } from "../shared/service.download-book-audio.js";
import { aiIcon, replaceIcon } from "./icons.js";
import "./component.auto-textarea.js";
import "./component.bar.js";
import "./component.book-field.js";
import "./component.checkbox.js";
import { cost, countTokens, countWords } from "../shared/util.book.js";
import { SuccessEvent } from "./event.success.js";
import { bookPingModelService } from "../shared/service.book-ping-model.js";

export const Modal = z.enum(["delete", "generate", "configure", "edit", "download", "details"]);
export type Modal = z.infer<typeof Modal>;

@customElement("torlify-book-editor")
export class TorlifyBookEditor extends LitElement {
  static override styles = [
    globalStyles,
    css`
      .stats {
        display: flex;
        gap: var(--size-large);
        margin-top: var(--size-medium);
        font-size: var(--font-small);
        color: var(--color-secondary-text);
      }

      .loading-button.loading:hover {
        background-color: var(--color-secondary-bold);
        box-shadow: var(--shadow-normal);
        transform: none;
      }
    `,
  ];

  @consume({ context: bookContext, subscribe: true })
  @property({ attribute: false })
  public bookContext: BookContext = {
    status: LoadingStatus.enum.idle,
  };

  @property({ type: Boolean })
  public loading: boolean = false;

  @property({ type: String })
  public loadingMessage: string = "Loading";

  @property({ type: Boolean })
  public regenerateChecked: boolean = false;

  @property({ type: Boolean })
  public testConnectivityLoading = false;

  override render(): TemplateResult {
    return html`
      ${this.bookContext.book
        ? html`
            <torlify-loading-overlay
              .visible=${this.loading}
              message="${this.loadingMessage}"></torlify-loading-overlay>
            <torlify-bar>
              <button class="standard-button" @click=${this.openModal(Modal.enum.generate)}>Generate</button>
              <button class="standard-button" @click=${this.openModal(Modal.enum.edit)}>Edit</button>
              <button class="standard-button" @click=${this.openModal(Modal.enum.download)}>Download</button>
            </torlify-bar>
            <torlify-bar>
              <button class="standard-button" @click=${this.openModal(Modal.enum.details)}>Details</button>
              <button class="standard-button" @click=${this.openModal(Modal.enum.configure)}>Configure</button>
              <button class="standard-button" @click=${this.openModal(Modal.enum.delete)}>Delete</button>
            </torlify-bar>
            <torlify-modal id="${Modal.enum.generate}-modal">
              <div slot="body">
                <h3>Generate Book</h3>
                <torlify-checkbox
                  off="Generate Missing Content"
                  on="Regenerate All Content"
                  .offIcon="${aiIcon}"
                  .onIcon="${replaceIcon}"
                  .checked="${this.regenerateChecked}"
                  @change="${this.handleRegenerateCheckedChange}"></torlify-checkbox>
                ${this.regenerateChecked
                  ? html`
                      <p>
                        All content for the entire book will be generated, replacing any existing content. This may take
                        a long time.
                      </p>
                    `
                  : html`
                      <p>
                        All missing content will be generated for the entire book but no existing content will be
                        replaced. This may take a long time.
                      </p>
                    `}
                <torlify-bar>
                  <button class="standard-button" @click="${this.generateOutlines(this.regenerateChecked)}">
                    Outline
                  </button>
                  <button class="standard-button" @click="${this.generateParts(this.regenerateChecked)}">Text</button>
                  <button class="standard-button" @click="${this.generateAudio(this.regenerateChecked)}">Audio</button>
                </torlify-bar>
              </div>
            </torlify-modal>
            <torlify-modal id="${Modal.enum.edit}-modal">
              <div slot="body">
                <h3>Edit</h3>
                <p>Edit the entire book based on your instructions</p>
                <torlify-bar>
                  <button class="standard-button" @click="${this.notImplemented(Modal.enum.edit)}">Edit</button>
                </torlify-bar>
              </div>
            </torlify-modal>
            <torlify-modal id="${Modal.enum.download}-modal">
              <div slot="body">
                <h3>Download</h3>
                <p>Download the complete book outline, text, or audio.</p>
                <torlify-bar>
                  <button class="standard-button" @click="${this.downloadOutline()}">Outline</button>
                  <button class="standard-button" @click="${this.downloadBook()}">Text</button>
                  <button class="standard-button" @click="${this.downloadAudio()}">Audio</button>
                </torlify-bar>
              </div>
            </torlify-modal>
            <torlify-modal id="${Modal.enum.details}-modal">
              <div slot="body">
                <h3>Details</h3>
                <torlify-book-field property="details.authorName"></torlify-book-field>
                <torlify-book-field property="details.isbn"></torlify-book-field>
                <torlify-book-field property="details.dedication"></torlify-book-field>
                <torlify-book-field property="details.acknowledgements"></torlify-book-field>
                <torlify-book-field property="details.aboutTheAuthor"></torlify-book-field>
                <torlify-book-field property="details.includeChapterTitles" type="boolean"></torlify-book-field>
              </div>
            </torlify-modal>
            <torlify-modal id="${Modal.enum.configure}-modal">
              <div slot="body">
                <h2>Configure</h2>
                <h3>Text Model Configuration</h3>
                <button
                  class="standard-button small loading-button ${this.testConnectivityLoading ? "loading" : ""}"
                  @click="${this.testConnectivity}"
                  ?disabled="${this.testConnectivityLoading}">
                  <span>Test Connectivity</span>
                  ${this.testConnectivityLoading
                    ? html`
                        <torlify-spinner size="18"></torlify-spinner>
                      `
                    : ""}
                </button>
                <torlify-book-field property="model.text.name"></torlify-book-field>
                <torlify-book-field property="model.text.modelName"></torlify-book-field>
                <torlify-book-field property="model.text.endpoint"></torlify-book-field>
                <torlify-book-field property="model.text.cost.inputTokenCost" type="number"></torlify-book-field>
                <torlify-book-field property="model.text.cost.outputTokenCost" type="number"></torlify-book-field>
                <h3>Audio Model Configuration</h3>
                <torlify-book-field property="model.audio.name"></torlify-book-field>
                <torlify-book-field property="model.audio.modelName"></torlify-book-field>
                <p>
                  <a href="https://platform.openai.com/docs/guides/text-to-speech/voice-options#voice-options">
                    OpenAI Voice options
                  </a>
                </p>
                <torlify-book-field property="model.audio.voice"></torlify-book-field>
                <torlify-book-field property="model.audio.endpoint"></torlify-book-field>
                <torlify-book-field property="model.audio.cost.inputTokenCost" type="number"></torlify-book-field>
                <torlify-book-field property="model.audio.cost.outputTokenCost" type="number"></torlify-book-field>
              </div>
            </torlify-modal>
            <torlify-modal id="${Modal.enum.delete}-modal">
              <div slot="body">
                <h3>Delete Book</h3>
                <p>Are you sure you want to delete this book?</p>
                <torlify-bar>
                  <button class="standard-button" @click="${this.confirmDeleteBook}">Delete</button>
                  <button class="standard-button" @click=${this.closeModal(Modal.enum.delete)}>Cancel</button>
                </torlify-bar>
              </div>
            </torlify-modal>
            <div class="secondary-surface">
              <torlify-book-field property="title" type="textarea" heading="h2"></torlify-book-field>
              <div class="stats">
                <span>${checkCompletion(this.bookContext.book)}% complete</span>
                <span>${formatNumber(this.tokens)} tokens</span>
                <span>$${formatNumber(this.cost, { decimals: 2 })}</span>
                <span>${formatNumber(this.words)} words</span>
                <span>Created on ${formatDate(this.bookContext.book.createdAt)}</span>
                <span>Last updated on ${formatDate(this.bookContext.book.updatedAt)}</span>
              </div>
            </div>
            <div class="secondary-surface">
              <h4>Overview</h4>
              <torlify-book-field property="overview" type="textarea"></torlify-book-field>
              <h4>Edit Instructions</h4>
              <torlify-book-field property="instructions.edit" type="textarea"></torlify-book-field>
              <h4>Audio Instructions</h4>
              <torlify-book-field property="instructions.audio" type="textarea"></torlify-book-field>
            </div>
          `
        : html`
            <p>Loading book...</p>
          `}
    `;
  }

  handleRegenerateCheckedChange(e: Event): void {
    const target = e.target as HTMLInputElement;
    this.regenerateChecked = target.checked;
  }

  downloadOutline(): () => void {
    return async (): Promise<void> => {
      const outlines: string[] = [];
      for (const chapter of this.bookContext.book?.chapters || []) {
        outlines.push(`# Chapter ${chapter.number}`);
        outlines.push("");
        for (const [index, partDescription] of chapter.outline.entries()) {
          outlines.push(`## Part ${index + 1}`);
          outlines.push(partDescription || "(No part description)");
          outlines.push("");
        }
        if (chapter.outline.length === 0) {
          outlines.push("(No chapter outline available)");
          outlines.push("");
        }
      }
      const text = outlines.join("\n");
      const blob = new Blob([text], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${this.bookContext.book?.title || "book"}-outline.md`;
      a.click();
      URL.revokeObjectURL(url);
      this.closeModal(Modal.enum.download)();
    };
  }

  downloadBook(): () => void {
    return async (): Promise<void> => {
      await downloadBookService.fetch({ book: this.bookContext.book!.id });
      this.closeModal(Modal.enum.download)();
    };
  }

  downloadAudio(): () => void {
    return async (): Promise<void> => {
      try {
        await downloadBookAudioService.fetch({ book: this.bookContext.book!.id });
      } catch (error) {
        console.error("Error downloading audio:", error);
        dispatch(this, WarningEvent("Failed to download audio"));
      } finally {
        this.closeModal(Modal.enum.download)();
      }
    };
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

  generate = async (callback: (chapter: Chapter) => Promise<void>): Promise<void> => {
    this.closeModal(Modal.enum.generate)();
    this.regenerateChecked = false;
    this.loading = true;
    this.loadingMessage = "Generating remaining content";
    try {
      for (const chapter of this.bookContext.book!.chapters) {
        await callback(chapter);
      }
      dispatch(this, NavigationEvent({ path: `/book/${this.bookContext.book!.id}` }));
    } catch (error) {
      console.error("Error generating remaining content:", error);
      dispatch(this, WarningEvent("Failed to generate remaining content"));
    } finally {
      this.loading = false;
    }
  };

  generateOutlines(regenerate: boolean): () => Promise<void> {
    return async (): Promise<void> => {
      this.generate(async (chapter: Chapter) => await this.generateOutlineForChapter(regenerate, chapter));
    };
  }

  generateParts(regenerate: boolean): () => Promise<void> {
    return async (): Promise<void> => {
      this.generate(async (chapter: Chapter) => await this.generatePartsForChapter(regenerate, chapter));
    };
  }

  generateAudio(regenerate: boolean): () => Promise<void> {
    return async (): Promise<void> => {
      this.generate(async (chapter: Chapter) => await this.generateAudioForChapter(regenerate, chapter));
    };
  }

  async generateOutlineForChapter(regenerate: boolean, chapter: Chapter): Promise<void> {
    const hasNoOutline = chapter.outline.filter((item) => !item || !item.trim()).length > 0;
    if (hasNoOutline || regenerate) {
      this.loading = true;
      this.loadingMessage = `Generating outline for chapter ${chapter.number}`;
      chapter = await generateChapterOutlineService.fetch({
        book: this.bookContext.book!.id,
        chapter: String(chapter.number),
      });
    }
  }

  async generatePartsForChapter(regenerate: boolean, chapter: Chapter): Promise<void> {
    const hasNoOutline = chapter.outline.some((partDescription) => !partDescription || partDescription.trim() === "");
    if (hasNoOutline) {
      dispatch(this, WarningEvent(`Outline required to generate parts for chapter ${chapter.number}`));
      return;
    }
    for (const part of chapter.parts) {
      await this.generatePartForChapter(regenerate, chapter, part);
    }
  }

  async generateAudioForChapter(regenerate: boolean, chapter: Chapter): Promise<void> {
    for (const part of chapter.parts) {
      await this.generateAudioForChapterPart(regenerate, chapter, part);
    }
  }

  async generatePartForChapter(regenerate: boolean, chapter: Chapter, part: ChapterPart): Promise<void> {
    const hasNoText = !part.text || part.text.trim() === "";
    if (hasNoText || regenerate) {
      this.loading = true;
      this.loadingMessage = `Generating part ${part.number} of chapter ${chapter.number}`;
      await generatePartService.fetch({
        book: this.bookContext.book!.id,
        chapter: String(chapter.number),
        part: String(part.number),
      });
    }
  }

  async generateAudioForChapterPart(regenerate: boolean, chapterObj: Chapter, partObj: ChapterPart): Promise<void> {
    const book = this.bookContext.book?.id;
    const chapter = String(chapterObj.number);
    const part = String(partObj.number);
    const hasNoAudio = !partObj.audio || partObj.audio.trim() === "";
    if (partObj.text === undefined || partObj.text.trim() === "") {
      dispatch(this, WarningEvent(`Cannot generate audio for part ${part} of chapter ${chapter} without text`));
      return;
    }
    if (!hasNoAudio && !regenerate) {
      dispatch(this, WarningEvent(`Audio already exists for part ${part} of chapter ${chapter}`));
      return;
    }
    if (!book || !chapter || !part) {
      dispatch(this, WarningEvent("Book, chapter, or part not loaded"));
      return;
    }
    this.loading = true;
    this.loadingMessage = `Generating audio for part ${part} of chapter ${chapter}`;
    await generatePartAudioService.fetch({ book, chapter, part });
  }

  confirmDeleteBook = async (): Promise<void> => {
    const bookId = this.bookContext.book!.id;
    try {
      await deleteBookService.fetch({ bookId });
      dispatch(this, WarningEvent("Book deleted successfully"));
    } catch {
      dispatch(this, WarningEvent("Book deletion failed"));
    } finally {
      this.closeModal(Modal.enum.delete);
      dispatch(this, NavigationEvent({ path: "/" }));
    }
  };

  testConnectivity = async (): Promise<void> => {
    try {
      this.testConnectivityLoading = true;
      const response = await bookPingModelService.fetch({ book: this.bookContext.book!.id });
      dispatch(this, SuccessEvent(response));
    } catch (error) {
      console.error("Connectivity test failed:", error);
      dispatch(this, WarningEvent("Model did not respond."));
    } finally {
      this.testConnectivityLoading = false;
    }
  };

  get tokens(): number {
    return countTokens(this.bookContext.book!);
  }

  get cost(): number {
    return cost(this.bookContext.book!);
  }

  get words(): number {
    return countWords(this.bookContext.book!);
  }
}
