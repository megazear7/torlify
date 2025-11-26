import { consume } from "@lit/context";
import { html, LitElement, TemplateResult } from "lit";
import { customElement, property } from "lit/decorators.js";
import { PartContext, partContext } from "./context.book.js";
import { LoadingStatus } from "../shared/type.loading.js";
import { globalStyles } from "./styles.global.js";
import { WarningEvent } from "./event.warning.js";
import { dispatch } from "./util.events.js";
import "./component.auto-textarea.js";
import "./component.bar.js";

@customElement("torlify-part-editor")
export class TorlifyPartEditor extends LitElement {
  static override styles = [globalStyles];

  @consume({ context: partContext, subscribe: true })
  @property({ attribute: false })
  public partContext: PartContext = {
    status: LoadingStatus.enum.idle,
  };

  override render(): TemplateResult {
    return html`
      ${this.partContext.part
        ? html`
            <torlify-bar>
              <button @click=${() => dispatch(this, WarningEvent("Not implemented"))} class="standard-button">Generate Part</button>
              <button @click=${() => dispatch(this, WarningEvent("Not implemented"))} class="standard-button">Edit Part</button>
              <button @click=${() => dispatch(this, WarningEvent("Not implemented"))} class="standard-button">Generate Audio</button>
            </torlify-bar>
            <div class="secondary-surface">
              <torlify-auto-textarea
                .value="${this.partContext.part.text}"
                @input="${(e: CustomEvent): void =>
                  (this.partContext.part!.text = e.detail.value)}"
              ></torlify-auto-textarea>
            </div>
          `
        : html`<p>Loading part...</p>`}
    `;
  }
}
