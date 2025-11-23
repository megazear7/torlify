import { css, html, LitElement, TemplateResult } from "lit";
import { customElement } from "lit/decorators.js";
import { globalStyles } from "./styles.global.js";
import "./component.auto-textarea.js";

@customElement("torlify-characters")
export class TorlifyBookEditor extends LitElement {
  static override styles = [
    globalStyles,
    css``,
  ];

  override render(): TemplateResult {
    return html`
      <div class="secondary-surface">
        <h4>Characters</h4>
        <p>TODO</p>
      </div>
    `;
  }

}
