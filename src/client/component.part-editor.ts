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
import { DebounceHandler } from "./util.debounce.js";
import "./component.auto-textarea.js";
import "./component.bar.js";
import { SaveEvent } from "./event.save.js";

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

  private debounceHandler = new DebounceHandler();

  override render(): TemplateResult {
    return html`
      ${this.partContext.part
        ? html`
            <torlify-bar>
              <button
                @click=${(): void =>
                  dispatch(this, WarningEvent("Not implemented"))}
                class="standard-button"
              >
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

  handleTextChange(): (event: CustomEvent) => void {
    return (event: CustomEvent): void => {
      if (!event.detail.value) return;
      this.partContext.part!.text = event.detail.value;
      this.debounceHandler.debounce(() => {
        updatePartService.fetch({
          book: this.bookContext.book?.id!,
          chapter: String(this.chapterContext.chapter?.number!),
          part: this.partContext.part!,
        });
        dispatch(this, SaveEvent());
      });
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
