import { consume } from "@lit/context";
import { html, css, LitElement, TemplateResult } from "lit";
import { customElement, property } from "lit/decorators.js";
import { PartContext, partContext } from "./context.book.js";
import { LoadingStatus } from "../shared/type.loading.js";
import { globalStyles } from "./styles.global.js";

@customElement("torlify-part-editor")
export class TorlifyPartEditor extends LitElement {
  static override styles = [globalStyles, css``];

  @consume({ context: partContext, subscribe: true })
  @property({ attribute: false })
  public partContext: PartContext = {
    status: LoadingStatus.enum.idle,
  };

  override render(): TemplateResult {
    return html`
      ${this.partContext.part
        ? html`
            <div class="secondary-surface">
              <p>${this.partContext.part.text}</p>
            </div>
          `
        : html`<p>Loading part...</p>`}
    `;
  }
}
