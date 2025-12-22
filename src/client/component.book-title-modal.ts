import { css, html, LitElement, TemplateResult } from "lit";
import { customElement, property, query, state } from "lit/decorators.js";
import { globalStyles } from "./styles.global.js";
import { consume } from "@lit/context";
import { BookContext, bookContext } from "./context.js";
import { LoadingStatus } from "../shared/type.loading.js";
import { InklifyModal } from "./component.modal.js";
import { aiIcon, audioIcon, gearIcon, trashIcon } from "./icons.js";
import { WarningEvent } from "./event.warning.js";
import { dispatch } from "./util.events.js";
import { generateBookTitleAudioService } from "../shared/service.generate-book-title-audio.js";
import { getBookTitleAudioService } from "../shared/service.get-book-title-audio.js";
import { deleteBookTitleAudioService } from "../shared/service.delete-book-title-audio.js";
import "./component.field.js";
import "./component.spinner.js";
import "./component.field.js";
import { SuccessEvent } from "./event.success.js";

@customElement("inklify-book-title-modal")
export class InklifyTitleModal extends LitElement {
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

  @consume({ context: bookContext, subscribe: true })
  @property({ attribute: false })
  public bookContext: BookContext = {
    status: LoadingStatus.enum.idle,
  };

  @property({ type: Boolean })
  public loading: boolean = false;

  @state()
  public audioUrl: string = "";

  @query("inklify-modal")
  public modal!: InklifyModal;

  @query("audio")
  public audioElement!: HTMLAudioElement;

  override render(): TemplateResult {
    return html`
      <button class="open" @click=${this.open()}>${gearIcon}</button>
      <inklify-modal id="config">
        <div slot="body">
          <h2>Title</h2>
          <inklify-field property="book.title" type="textarea" heading="h2"></inklify-field>
          <inklify-bar label="Audio Actions">
            <button class="standard-button" @click=${this.generate()} ?disabled=${this.loading}>
              ${aiIcon} Generate
              ${this.loading
                ? html`
                    <inklify-spinner size="18"></inklify-spinner>
                  `
                : ""}
            </button>
            <button class="standard-button" @click=${this.listen()}>${audioIcon} Listen</button>
            <button class="standard-button" @click=${this.delete()}>${trashIcon} Delete</button>
          </inklify-bar>
          <audio src="${this.audioUrl}" controls></audio>
        </div>
      </inklify-modal>
    `;
  }

  generate(): () => void {
    return async (): Promise<void> => {
      const book = this.bookContext.book;
      if (!book) {
        dispatch(this, WarningEvent("Book not loaded"));
        return;
      }
      if (!book.model.audio.voice) {
        dispatch(this, WarningEvent("No audio voice selected. Please update this configuration."));
        return;
      }
      this.loading = true;
      try {
        await generateBookTitleAudioService.fetch({
          book: book.id,
        });
        this.audioUrl = getBookTitleAudioService.renderPath({
          book: this.bookContext.book?.id || "",
        });
        this.requestUpdate();
        dispatch(this, SuccessEvent("Book title audio generated successfully."));
      } catch (error) {
        console.error("Error generating book title audio:", error);
        dispatch(this, WarningEvent("Failed to generate book title audio."));
      } finally {
        this.loading = false;
      }
    };
  }

  listen(): () => void {
    return (): void => {
      const book = this.bookContext.book;
      if (!book) {
        dispatch(this, WarningEvent("Book not loaded"));
        return;
      }
      this.audioElement.play();
    };
  }

  delete(): () => void {
    return async (): Promise<void> => {
      const book = this.bookContext.book;
      if (!book) {
        dispatch(this, WarningEvent("Book not loaded"));
        return;
      }
      try {
        await deleteBookTitleAudioService.fetch({
          book: book.id,
        });
        this.audioUrl = "";
        this.requestUpdate();
        dispatch(this, SuccessEvent("Book title audio deleted successfully."));
      } catch (error) {
        console.error("Error deleting book title audio:", error);
        dispatch(this, WarningEvent("Failed to delete book title audio."));
      }
    };
  }

  open(): () => void {
    return (): void => {
      this.audioUrl = getBookTitleAudioService.renderPath({
        book: this.bookContext.book?.id || "",
      });
      this.requestUpdate();
      this.modal.open();
    };
  }
}
