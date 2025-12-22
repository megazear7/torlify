import { css, html, LitElement, TemplateResult } from "lit";
import { customElement, property, query } from "lit/decorators.js";
import { globalStyles } from "./styles.global.js";
import { consume } from "@lit/context";
import { BookContext, bookContext } from "./context.js";
import { LoadingStatus } from "../shared/type.loading.js";
import { InklifyModal } from "./component.modal.js";
import { audioIcon, gearIcon } from "./icons.js";
import { WarningEvent } from "./event.warning.js";
import { dispatch } from "./util.events.js";
import { Pronunciation } from "../shared/type.book.js";
import { PronunciationUpdatedEvent } from "./event.pronunciation-updated.js";
import { generatePronunciationAudioService } from "../shared/service.generate-pronunciation-audio.js";
import "./component.field.js";
import "./component.spinner.js";
import "./component.field.js";
import "./component.bar.js";

@customElement("inklify-configure-pronunciation")
export class InklifyConfigurePronunciation extends LitElement {
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
    `,
  ];

  @consume({ context: bookContext, subscribe: true })
  @property({ attribute: false })
  public bookContext: BookContext = {
    status: LoadingStatus.enum.idle,
  };

  @property({ type: Object })
  public pronunciation!: Pronunciation;

  @property({ type: Boolean })
  public loading: boolean = false;

  @query("inklify-modal")
  public modal!: InklifyModal;

  @query("audio")
  public audioElement!: HTMLAudioElement;

  override render(): TemplateResult {
    return html`
      <button class="open" @click=${this.open()}>${gearIcon}</button>
      <inklify-modal id="config">
        <div slot="body">
          <h2>Configure pronunciation</h2>
          <div class="pronunciation-item">
            <div class="pronunciation-field">
              <label class="pronunciation-label">Match Text</label>
              <input
                class="pronunciation-input"
                type="text"
                placeholder="Word or phrase to replace"
                .value=${this.pronunciation.match}
                @input=${this.handleMatchInput()} />
            </div>
            <div class="pronunciation-field">
              <label class="pronunciation-label">Replace With</label>
              <input
                class="pronunciation-input"
                type="text"
                placeholder="Pronunciation replacement"
                .value=${this.pronunciation.replace}
                @input=${this.handleReplaceInput()} />
            </div>
          </div>
          <inklify-bar>
            <button class="standard-button" @click=${this.listen()} ?disabled=${this.loading}>
              ${this.loading
                ? html`
                    <inklify-spinner></inklify-spinner>
                  `
                : audioIcon}
              Listen
            </button>
          </inklify-bar>
          <audio controls style="display: none;"></audio>
        </div>
      </inklify-modal>
    `;
  }

  handleMatchInput(): (e: Event) => void {
    return (e: Event): void => {
      console.log("A");
      dispatch(
        this,
        PronunciationUpdatedEvent({
          field: "match",
          value: (e.target as HTMLInputElement).value,
        }),
      );
      this.pronunciation.match = (e.target as HTMLInputElement).value;
    };
  }

  handleReplaceInput(): (e: Event) => void {
    return (e: Event): void => {
      dispatch(
        this,
        PronunciationUpdatedEvent({
          field: "replace",
          value: (e.target as HTMLInputElement).value,
        }),
      );
      this.pronunciation.replace = (e.target as HTMLInputElement).value;
    };
  }

  listen(): () => void {
    return async (): Promise<void> => {
      const book = this.bookContext.book;
      if (!book) {
        dispatch(this, WarningEvent("Book not loaded"));
        return;
      }
      if (!this.pronunciation.replace || this.pronunciation.replace.trim() === "") {
        dispatch(this, WarningEvent("No replacement text to pronounce"));
        return;
      }

      this.loading = true;
      try {
        const response = await generatePronunciationAudioService.fetch({
          book: book.id,
          text: this.pronunciation.replace,
        });

        // Convert base64 audio data to a blob URL
        const audioData = response.audioData;
        const binaryString = atob(audioData);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        const blob = new Blob([bytes], { type: "audio/mpeg" });
        const audioUrl = URL.createObjectURL(blob);

        this.audioElement.src = audioUrl;
        this.audioElement.play();
      } catch (error) {
        console.error("Error generating pronunciation audio:", error);
        dispatch(this, WarningEvent("Failed to generate pronunciation audio."));
      } finally {
        this.loading = false;
      }
    };
  }

  open(): () => void {
    return (): void => {
      this.modal.open();
    };
  }
}
