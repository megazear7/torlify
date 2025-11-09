import { consume } from "@lit/context";
import { html, css, LitElement, TemplateResult } from "lit";
import { customElement, property } from "lit/decorators.js";
import { PartContext, partContext } from "./context.book.js";
import { LoadingStatus } from "../shared/type.loading.js";

@customElement("torlify-part-editor")
export class TorlifyPartEditor extends LitElement {
  static override styles = css`
    p {
      color: var(--color-1);
    }
  `;

  @consume({ context: partContext, subscribe: true })
  @property({ attribute: false })
  public partContext: PartContext = {
    status: LoadingStatus.enum.idle,
  };

  override render(): TemplateResult {
    return html`
      ${this.partContext.part
        ? html`<p>${this.partContext.part.text}</p>`
        : html`<p>Loading part...</p>`}
    `;
  }
}
