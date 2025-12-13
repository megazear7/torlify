import { consume } from "@lit/context";
import { css, html, LitElement, TemplateResult } from "lit";
import { customElement, property, query } from "lit/decorators.js";
import { bookContext, BookContext, ChapterContext, chapterContext, PartContext, partContext } from "./context.js";
import { LoadingStatus } from "../shared/type.loading.js";
import { globalStyles } from "./styles.global.js";
import { WarningEvent } from "./event.warning.js";
import { dispatch } from "./util.events.js";
import { updatePartService } from "../shared/service.update-part.js";
import { updateChapterService } from "../shared/service.update-chapter.js";
import { DebounceHandler } from "./util.debounce.js";
import { SaveEvent } from "./event.save.js";
import { NavigationEvent } from "./event.navigation.js";
import { generatePartService } from "../shared/service.generate-part.js";
import { generatePartAudioService } from "../shared/service.generate-part-audio.js";
import { getChapterAudioService } from "../shared/service.get-part-audio.js";
import z from "zod";
import "./component.auto-textarea.js";
import "./component.bar.js";
import { TorlifyModal } from "./component.modal.js";
import { aiIcon, replaceIcon } from "./icons.js";
import { generatePartOutlineService } from "../shared/service.generate-part-outline.js";
import { createOutlineForPart } from "../shared/util.book.js";
import { downloadTextFile } from "./util.download.js";
import { handleError } from "./util.error.js";
import { downloadPartAudioService } from "../shared/service.download-part-audio.js";
import "./component.audio.js";

export const Modal = z.enum(["generate", "edit", "download", "move", "add", "delete"]);
export type Modal = z.infer<typeof Modal>;

@customElement("torlify-part-editor")
export class TorlifyPartEditor extends LitElement {
  static override styles = [
    globalStyles,
    css`
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

  @query("#part-audio")
  partAudioElement!: HTMLAudioElement;

  private debounceHandler = new DebounceHandler();

  override render(): TemplateResult {
    return html`
      ${this.partContext.part
        ? html`
            <torlify-loading-overlay
              .visible="${this.loading}"
              message="${this.loadingMessage}"></torlify-loading-overlay>
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
                <h3>Generate Part</h3>
                <torlify-checkbox
                  off="Generate Missing Content"
                  on="Regenerate All Content"
                  .offIcon="${aiIcon}"
                  .onIcon="${replaceIcon}"
                  .checked="${this.regenerateChecked}"
                  @change="${this.handleRegenerateCheckedChange}"></torlify-checkbox>
                ${this.regenerateChecked
                  ? html`
                      <p>The part will be regenerated, replacing any existing content.</p>
                    `
                  : html`
                      <p>The part will be generated only if content is missing.</p>
                    `}
                <torlify-bar>
                  <button class="standard-button" @click="${this.generateOutline()}">Outline</button>
                  <button class="standard-button" @click="${this.generateText()}">Text</button>
                  <button class="standard-button" @click="${this.generateAudio()}">Audio</button>
                </torlify-bar>
              </div>
            </torlify-modal>
            <torlify-modal id="${Modal.enum.edit}-modal">
              <div slot="body">
                <h3>Edit Part</h3>
                <p>Edit the part based on your instructions</p>
                <torlify-bar>
                  <button class="standard-button" @click="${this.notImplemented(Modal.enum.edit)}">Edit</button>
                </torlify-bar>
              </div>
            </torlify-modal>
            <torlify-modal id="${Modal.enum.download}-modal">
              <div slot="body">
                <h3>Download Part</h3>
                <p>Download the part text or audio.</p>
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
                <h3>Move Part</h3>
                <p>Move this part before the previous part or after the next part?</p>
                <torlify-bar>
                  <button class="standard-button" @click="${this.moveBeforePrevious()}">Before previous</button>
                  <button class="standard-button" @click="${this.moveAfterNext()}">After next</button>
                </torlify-bar>
              </div>
            </torlify-modal>
            <torlify-modal id="${Modal.enum.add}-modal">
              <div slot="body">
                <h3>Add Part</h3>
                <p>Add a new part before the previous part or after the next part?</p>
                <torlify-bar>
                  <button class="standard-button" @click="${this.addPartBeforePrevious()}">Before previous</button>
                  <button class="standard-button" @click="${this.addPartAfterNext()}">After next</button>
                </torlify-bar>
              </div>
            </torlify-modal>
            <torlify-modal id="${Modal.enum.delete}-modal">
              <div slot="body">
                <h3>Delete Part</h3>
                <p>Are you sure you want to delete this part?</p>
                <div class="delete-options">
                  <torlify-bar>
                    <button class="standard-button" @click="${this.notImplemented(Modal.enum.delete)}">Outline</button>
                    <button class="standard-button" @click=${this.notImplemented(Modal.enum.delete)}>Text</button>
                    <button class="standard-button" @click=${this.notImplemented(Modal.enum.delete)}>Audio</button>
                  </torlify-bar>
                  <torlify-bar>
                    <button class="standard-button delete" @click="${this.removePart()}">Delete</button>
                  </torlify-bar>
                </div>
              </div>
            </torlify-modal>
            <div class="secondary-surface">
              ${this.partContext.part.audio
                ? html`
                    <torlify-audio
                      src="${getChapterAudioService.renderPath({
                        book: this.bookContext.book!.id,
                        chapter: String(this.chapterContext.chapter!.number),
                        part: String(this.partContext.part!.number),
                      })}"></torlify-audio>
                  `
                : html`
                    <p>No audio available</p>
                  `}
              <torlify-auto-textarea
                .value="${this.partContext.part.text}"
                @input=${this.handleTextChange()}></torlify-auto-textarea>
            </div>
          `
        : html`
            <p>Loading part...</p>
          `}
    `;
  }

  moveBeforePrevious(): () => void {
    return async (): Promise<void> => {
      this.closeModal(Modal.enum.move)();
      dispatch(this, WarningEvent("Move part before previous is not implemented yet"));
    };
  }

  moveAfterNext(): () => void {
    return async (): Promise<void> => {
      this.closeModal(Modal.enum.move)();
      dispatch(this, WarningEvent("Move part after next is not implemented yet"));
    };
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

  generateOutline(): () => void {
    return async (): Promise<void> => {
      const book = this.bookContext.book;
      const chapter = this.chapterContext.chapter;
      const part = this.partContext.part;
      if (!book || !chapter || !part) {
        dispatch(this, WarningEvent("Book, chapter, or part not loaded"));
        return;
      }
      const hasOutline = chapter.outline[part.number - 1]?.trim() !== "";
      if (!this.regenerateChecked && hasOutline) {
        dispatch(this, WarningEvent("Part already has an outline."));
        return;
      }
      this.closeModal(Modal.enum.generate)();
      this.loading = true;
      this.loadingMessage = `Generating outline for part ${part.number} of chapter ${chapter.number}`;
      try {
        this.chapterContext.chapter = await generatePartOutlineService.fetch({
          book: book.id,
          chapter: String(chapter.number),
          part: String(part.number),
        });
        // TODO: The page should automatically render but for some reason that is not working
        // For now, we navigate to the part to show updated outline
        dispatch(this, NavigationEvent({ path: `/book/${book.id}/chapter/${chapter.number}/part/${part.number}` }));
      } catch {
        dispatch(this, WarningEvent("Failed to generate outline"));
      }
      this.loading = false;
    };
  }

  generateText(): () => void {
    return async (): Promise<void> => {
      const book = this.bookContext.book;
      const chapter = this.chapterContext.chapter;
      const part = this.partContext.part;
      if (!book || !chapter || !part) {
        dispatch(this, WarningEvent("Book, chapter, or part not loaded"));
        return;
      }
      const hasText = !!part.text && part.text.trim() !== "";
      if (!this.regenerateChecked && hasText) {
        dispatch(this, WarningEvent("Part already has text."));
        return;
      }
      this.closeModal(Modal.enum.generate)();
      this.loading = true;
      this.loadingMessage = `Generating text for part ${part.number} of chapter ${chapter.number}`;
      try {
        this.partContext.part = await generatePartService.fetch({
          book: book.id,
          chapter: String(chapter.number),
          part: String(part.number),
        });
      } catch {
        dispatch(this, WarningEvent("Failed to generate part"));
      }
      this.loading = false;
    };
  }

  generateAudio(): () => void {
    return async (): Promise<void> => {
      const book = this.bookContext.book;
      const chapter = this.chapterContext.chapter;
      const part = this.partContext.part;
      if (!book || !chapter || !part) {
        dispatch(this, WarningEvent("Book, chapter, or part not loaded"));
        return;
      }
      const hasAudio = !!part.audio;
      if (!this.regenerateChecked && hasAudio) {
        dispatch(this, WarningEvent("Part already has audio."));
        return;
      }
      const hasText = !!part.text && part.text.trim() !== "";
      if (!hasText) {
        dispatch(this, WarningEvent("Part must have text before generating audio."));
        return;
      }
      if (!book.model.audio.voice) {
        dispatch(this, WarningEvent("No audio voice selected. Please update this configuration."));
        return;
      }
      this.closeModal(Modal.enum.generate)();
      this.loading = true;
      this.loadingMessage = `Generating audio for part ${part.number} of chapter ${chapter.number} with the ${book.model.audio.voice} voice`;
      try {
        await generatePartAudioService.fetch({
          book: book.id,
          chapter: String(chapter.number),
          part: String(part.number),
        });
      } catch {
        dispatch(this, WarningEvent("Failed to generate audio"));
      }
      this.loading = false;
    };
  }

  downloadOutline() {
    return (): void => {
      const text = createOutlineForPart(this.chapterContext.chapter!, this.partContext.part!);
      downloadTextFile(
        text,
        `${this.bookContext.book?.title || "book"} Chapter ${this.chapterContext.chapter?.number || 1} Part ${this.partContext.part?.number || 1} Outline.md`,
      );
      this.closeModal(Modal.enum.download)();
    };
  }

  downloadText() {
    return (): void => {
      const text = this.partContext.part!.text;
      downloadTextFile(
        text,
        `${this.bookContext.book?.title || "book"} Chapter ${this.chapterContext.chapter?.number || 1} Part ${this.partContext.part?.number || 1} Text.md`,
      );
      this.closeModal(Modal.enum.download)();
    };
  }

  downloadAudio(): () => void {
    return async (): Promise<void> => {
      try {
        this.downloadingAudio = true;
        await downloadPartAudioService.fetch({
          book: this.bookContext.book!.id,
          chapter: String(this.chapterContext.chapter!.number),
          part: String(this.partContext.part!.number),
        });
        this.downloadingAudio = false;
      } catch (error) {
        handleError(this, error, "Failed to download part audio");
      } finally {
        this.closeModal(Modal.enum.download)();
      }
    };
  }

  handleTextChange(): (event: CustomEvent) => void {
    return (event: CustomEvent): void => {
      if (event.detail.value === undefined) return;
      this.partContext.part!.text = event.detail.value;
      this.debounceHandler.debounce(async () => {
        const book = this.bookContext.book;
        const chapter = this.chapterContext.chapter;
        const part = this.partContext.part;
        if (!book || !chapter || !part) {
          dispatch(this, WarningEvent("Book, chapter, or part not loaded"));
          return;
        }
        await updatePartService.fetch({
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
      this.closeModal(Modal.enum.delete)();
      const book = this.bookContext.book;
      const chapter = this.chapterContext.chapter;
      const part = this.partContext.part;

      if (!book || !chapter || !part) {
        dispatch(this, WarningEvent("Book, chapter, or part not loaded"));
        return;
      }

      const partIndex = chapter.parts.findIndex((p) => p.number === part.number);
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
        const targetPart = chapter.parts.find((p) => p.number === newPartNumber);

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

  addPartBeforePrevious(): () => void {
    return async (): Promise<void> => {
      this.closeModal(Modal.enum.add)();
      dispatch(this, WarningEvent("Add part before previous is not implemented yet"));
    };
  }

  addPartAfterNext(): () => void {
    return async (): Promise<void> => {
      this.closeModal(Modal.enum.add)();
      const book = this.bookContext.book;
      const chapter = this.chapterContext.chapter;
      const part = this.partContext.part;

      if (!book || !chapter || !part) {
        dispatch(this, WarningEvent("Book, chapter, or part not loaded"));
        return;
      }

      const partIndex = chapter.parts.findIndex((p) => p.number === part.number);
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
