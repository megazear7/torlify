import { consume } from "@lit/context";
import { html, LitElement, TemplateResult } from "lit";
import { customElement, property } from "lit/decorators.js";
import { BookContext, bookContext } from "./context.book.js";
import { LoadingStatus } from "../shared/type.loading.js";
import { globalStyles } from "./styles.global.js";
import "./component.auto-textarea.js";

@customElement("torlify-book-editor")
export class TorlifyBookEditor extends LitElement {
  static override styles = [globalStyles];

  @consume({ context: bookContext, subscribe: true })
  @property({ attribute: false })
  public bookContext: BookContext = {
    status: LoadingStatus.enum.idle,
  };

  override render(): TemplateResult {
    return html`
      ${this.bookContext.book
        ? html`
            <div class="secondary-surface">
              <torlify-auto-textarea
                cssClass="h2"
                .value="${this.bookContext.book.title}"
                @input="${(e: CustomEvent): void =>
                  (this.bookContext.book!.title = e.detail.value)}"
              ></torlify-auto-textarea>
              <h4>Overview</h4>
              <torlify-auto-textarea
                .value="${this.bookContext.book.overview}"
                @input="${(e: CustomEvent): void =>
                  (this.bookContext.book!.overview = e.detail.value)}"
              ></torlify-auto-textarea>
              <h4>Edit Instructions</h4>
              <torlify-auto-textarea
                .value="${this.bookContext.book.instructions.edit}"
                @input="${(e: CustomEvent): void =>
                  (this.bookContext.book!.instructions.edit = e.detail.value)}"
              ></torlify-auto-textarea>
              <h4>Audio Instructions</h4>
              <torlify-auto-textarea
                .value="${this.bookContext.book.instructions.audio}"
                @input="${(e: CustomEvent): void =>
                  (this.bookContext.book!.instructions.audio = e.detail.value)}"
              ></torlify-auto-textarea>
            </div>
          `
        : html`<p>Loading book...</p>`}
    `;
  }
}
