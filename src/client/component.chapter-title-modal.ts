import { css, html, LitElement, TemplateResult } from "lit";
import { customElement, property, query, state } from "lit/decorators.js";
import { globalStyles } from "./styles.global.js";
import { consume } from "@lit/context";
import { ChapterContext, chapterContext } from "./context.js";
import { BookContext, bookContext } from "./context.js";
import { LoadingStatus } from "../shared/type.loading.js";
import { TorlifyModal } from "./component.modal.js";
import { aiIcon, audioIcon, gearIcon, trashIcon } from "./icons.js";
import { WarningEvent } from "./event.warning.js";
import { dispatch } from "./util.events.js";
import { SuccessEvent } from "./event.success.js";
import { generateChapterTitleAudioService } from "../shared/service.generate-chapter-title-audio.js";
import { getChapterTitleAudioService } from "../shared/service.get-chapter-title-audio.js";
import { deleteChapterTitleAudioService } from "../shared/service.delete-chapter-title-audio.js";
import "./component.field.js";
import "./component.spinner.js";
import "./component.bar.js";

@customElement("torlify-chapter-title-modal")
export class TorlifyChapterTitleModal extends LitElement {
  static override styles = [
    globalStyles,
    css`
      :host {
        display: inline-block;
      }

      .open svg {
        color: var(--color-secondary-text);
        transition: var(--transition-all);
        display: inline-block;
      }

      .open:hover svg {
        color: var(--color-2);
        cursor: pointer;
      }

      audio {
        display: none;
      }
    `,
  ];

  @consume({ context: chapterContext, subscribe: true })
  @property({ attribute: false })
  public chapterContext: ChapterContext = {
    status: LoadingStatus.enum.idle,
  };

  @consume({ context: bookContext, subscribe: true })
  @property({ attribute: false })
  public bookContext: BookContext = {
    status: LoadingStatus.enum.idle,
  };

  @query("torlify-modal")
  public modal!: TorlifyModal;

  @query("audio")
  public audioElement!: HTMLAudioElement;

  @property({ type: Boolean })
  public loading: boolean = false;

  @state()
  public audioUrl: string = "";

  override render(): TemplateResult {
    return html`
      <button class="open" @click=${this.open()}>${gearIcon}</button>
      <torlify-modal id="config">
        <div slot="body">
          <h2>Title</h2>
          <torlify-field property="chapter.title" type="textarea" heading="h2"></torlify-field>
          <torlify-bar label="Audio Actions">
            <button class="standard-button" @click=${this.generate()} ?disabled=${this.loading}>
              ${this.loading
                ? html`
                    <torlify-spinner></torlify-spinner>
                  `
                : aiIcon}
              Generate
            </button>
            <button class="standard-button" @click=${this.listen()}>${audioIcon} Listen</button>
            <button class="standard-button" @click=${this.delete()}>${trashIcon} Delete</button>
          </torlify-bar>
          <audio src="${this.audioUrl}" controls></audio>
        </div>
      </torlify-modal>
    `;
  }

  generate(): () => void {
    return async (): Promise<void> => {
      const book = this.bookContext.book;
      const chapter = this.chapterContext.chapter;
      if (!book) {
        dispatch(this, WarningEvent("Book not loaded"));
        return;
      }
      if (!chapter) {
        dispatch(this, WarningEvent("Chapter not loaded"));
        return;
      }
      if (!book.model.audio.voice) {
        dispatch(this, WarningEvent("No audio voice selected. Please update this configuration."));
        return;
      }
      this.loading = true;
      try {
        await generateChapterTitleAudioService.fetch({
          book: book.id,
          chapter: String(chapter.number),
        });
        this.audioUrl = getChapterTitleAudioService.renderPath({
          book: this.bookContext.book?.id || "",
          chapter: String(this.chapterContext.chapter?.number || ""),
        });
        this.requestUpdate();
        dispatch(this, SuccessEvent("Chapter title audio generated successfully."));
      } catch (error) {
        console.error("Error generating chapter title audio:", error);
        dispatch(this, WarningEvent("Failed to generate chapter title audio."));
      } finally {
        this.loading = false;
      }
    };
  }

  listen(): () => void {
    return (): void => {
      const book = this.bookContext.book;
      const chapter = this.chapterContext.chapter;
      if (!book) {
        dispatch(this, WarningEvent("Book not loaded"));
        return;
      }
      if (!chapter) {
        dispatch(this, WarningEvent("Chapter not loaded"));
        return;
      }
      this.audioElement.play();
    };
  }

  delete(): () => void {
    return async (): Promise<void> => {
      const book = this.bookContext.book;
      const chapter = this.chapterContext.chapter;
      if (!book) {
        dispatch(this, WarningEvent("Book not loaded"));
        return;
      }
      if (!chapter) {
        dispatch(this, WarningEvent("Chapter not loaded"));
        return;
      }
      try {
        await deleteChapterTitleAudioService.fetch({
          book: book.id,
          chapter: String(chapter.number),
        });
        this.audioUrl = "";
        this.requestUpdate();
        dispatch(this, SuccessEvent("Chapter title audio deleted successfully."));
      } catch (error) {
        console.error("Error deleting chapter title audio:", error);
        dispatch(this, WarningEvent("Failed to delete chapter title audio."));
      }
    };
  }

  open(): () => void {
    return (): void => {
      this.audioUrl = getChapterTitleAudioService.renderPath({
        book: this.bookContext.book?.id || "",
        chapter: String(this.chapterContext.chapter?.number || ""),
      });
      this.requestUpdate();
      this.modal.open();
    };
  }
}
