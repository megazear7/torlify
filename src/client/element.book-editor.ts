import {consume} from '@lit/context';
import { html, css, LitElement, TemplateResult } from "lit";
import { customElement, property } from "lit/decorators.js";
import { BookContext, bookContext } from "./context.book.js";

@customElement("torlify-book-editor")
export class TorlifyBookEditor extends LitElement {
  static override styles = css`
    p {
      color: var(--color-1);
    }
  `;

  @consume({context: bookContext})
  @property({attribute: false})
  public bookContext?: BookContext;

  override render(): TemplateResult {
    return html`
      <p>Book Component!</p>
    `;
  }

  override async connectedCallback(): Promise<void> {
    super.connectedCallback();
  }
}
