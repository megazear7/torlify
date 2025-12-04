import { consume } from "@lit/context";
import { css, html, LitElement, TemplateResult } from "lit";
import { customElement, property } from "lit/decorators.js";
import { BookContext, bookContext } from "./context.book.js";
import { LoadingStatus } from "../shared/type.loading.js";
import { globalStyles } from "./styles.global.js";
import { formatNumber } from "../shared/util.number.js";
import { dispatch } from "./util.events.js";
import { WarningEvent } from "./event.warning.js";
import { downloadBookService } from "../shared/service.download-book.js";
import { TorlifyModal } from "./component.modal.js";
import { deleteBookService } from "../shared/service.delete-book.js";
import { NavigationEvent } from "./event.navigation.js";
import { generateChapterOutlineService } from "../shared/service.generate-chapter-outline.js";
import { generatePartService } from "../shared/service.generate-part.js";
import z from "zod";
import "./component.auto-textarea.js";
import "./component.bar.js";
import "./component.book-field.js";
import { Chapter, ChapterPart } from "../shared/type.book.js";

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

  override render(): TemplateResult {
    return html`
      ${this.bookContext.book
        ? html`
            <torlify-loading-overlay .visible=${this.loading} message="${this.loadingMessage}"></torlify-loading-overlay>
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
                <h3>Generate Remaining Content?</h3>
                <p>Are you sure you want to generate the remaining content for this book?</p>
                <p>It may take a long time.</p>
                <torlify-bar>
                  <button class="standard-button" @click="${this.generateOutlines}">Outline</button>
                  <button class="standard-button" @click="${this.generateParts}">Text</button>
                  <button class="standard-button" @click="${this.notImplemented(Modal.enum.generate)}">Audio</button>
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
                  <button class="standard-button" @click="${this.notImplemented(Modal.enum.download)}">Outline</button>
                  <button class="standard-button" @click="${this.downloadBook()}">Text</button>
                  <button class="standard-button" @click="${this.notImplemented(Modal.enum.download)}">Audio</button>
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
                <torlify-book-field property="model.text.name"></torlify-book-field>
                <torlify-book-field property="model.text.modelName"></torlify-book-field>
                <torlify-book-field property="model.text.endpoint"></torlify-book-field>
                <torlify-book-field property="model.text.cost.inputTokenCost" type="number"></torlify-book-field>
                <torlify-book-field property="model.text.cost.outputTokenCost" type="number"></torlify-book-field>
                <h3>Audio Model Configuration</h3>
                <torlify-book-field property="model.audio.name"></torlify-book-field>
                <torlify-book-field property="model.audio.modelName"></torlify-book-field>
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
                <span>${formatNumber(this.tokens)} tokens</span>
                <span>$${formatNumber(this.cost, { decimals: 2 })}</span>
                <span>${formatNumber(this.words)} words</span>
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
        : html`<p>Loading book...</p>`}
    `;
  }

  downloadBook(): () => void {
    return async (): Promise<void> => {
      await downloadBookService.fetch({ book: this.bookContext.book!.id });
      this.closeModal(Modal.enum.download)();
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
    this.loading = true;
    this.loadingMessage = "Generating remaining content";
    try {
      for (let chapter of this.bookContext.book!.chapters) {
        await callback(chapter);
      }
      dispatch(
        this,
        NavigationEvent({ path: `/book/${this.bookContext.book!.id}` }),
      );
    } catch (error) {
      console.error("Error generating remaining content:", error);
      dispatch(this, WarningEvent("Failed to generate remaining content"));
    } finally {
      this.loading = false;
    }
  };

  generateOutlines = async (): Promise<void> => {
    this.generate(async (chapter: Chapter) => await this.generateOutlineForChapter(chapter));
  };

  generateParts = async (): Promise<void> => {
    this.generate(async (chapter: Chapter) => await this.generatePartsForChapter(chapter));
  };

  async generateOutlineForChapter(chapter: Chapter): Promise<void> {
    this.loading = true;
    this.loadingMessage = `Generating outline for chapter ${chapter.number}`;
    const generateOutline = chapter.outline.filter((item) => !item || !item.trim()).length > 0;
    if (generateOutline) {
      chapter = await generateChapterOutlineService.fetch({
        book: this.bookContext.book!.id,
        chapter: String(chapter.number),
      });
    }
  };

  async generatePartsForChapter(chapter: Chapter): Promise<void> {
    await this.generateOutlineForChapter(chapter);
    for (const part of chapter.parts) {
      await this.generatePartForChapter(chapter, part);
    }
  };

  async generatePartForChapter(chapter: Chapter, part: ChapterPart): Promise<void> {
    if (!part.text || part.text.trim() === "") {
      this.loading = true;
      this.loadingMessage = `Generating part ${part.number} of chapter ${chapter.number}`;
      await generatePartService.fetch({
        book: this.bookContext.book!.id,
        chapter: String(chapter.number),
        part: String(part.number),
      });
    }
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

  get tokens(): number {
    const tokenCounts = [
      this.bookContext.book?.model.text.usage.completion_tokens || 0,
      this.bookContext.book?.model.text.usage.prompt_tokens || 0,
      this.bookContext.book?.model.audio.usage.completion_tokens || 0,
      this.bookContext.book?.model.audio.usage.prompt_tokens || 0,
    ];
    return tokenCounts.reduce((acc, curr) => acc + curr, 0);
  }

  get cost(): number {
    const oneMillionth = 1 / 1000000;
    const textCompletionCost =
      (this.bookContext.book?.model.text.usage.completion_tokens || 0) *
      (this.bookContext.book?.model.text.cost.outputTokenCost || 0) *
      oneMillionth;
    const textPromptCost =
      (this.bookContext.book?.model.text.usage.prompt_tokens || 0) *
      (this.bookContext.book?.model.text.cost.inputTokenCost || 0) *
      oneMillionth;
    const audioCompletionCost =
      (this.bookContext.book?.model.audio.usage.completion_tokens || 0) *
      (this.bookContext.book?.model.audio.cost.outputTokenCost || 0) *
      oneMillionth;
    const audioPromptCost =
      (this.bookContext.book?.model.audio.usage.prompt_tokens || 0) *
      (this.bookContext.book?.model.audio.cost.inputTokenCost || 0) *
      oneMillionth;

    return (
      textCompletionCost +
      textPromptCost +
      audioCompletionCost +
      audioPromptCost
    );
  }

  get words(): number {
    return (
      this.bookContext.book?.chapters.reduce((acc, chapter) => {
        const partWords = chapter.parts.reduce((partAcc, part) => {
          const wordsInPart = part.text
            ? part.text.trim().split(/\s+/).length
            : 0;
          return partAcc + wordsInPart;
        }, 0);
        return acc + partWords;
      }, 0) || 0
    );
  }
}
