import { html, css, LitElement, TemplateResult } from "lit";
import { customElement, property } from "lit/decorators.js";
import { globalStyles } from "./styles.global";

@customElement("torlify-modal")
export class TorlifyModal extends LitElement {
  static override styles = [globalStyles, css`
    .modal-backdrop {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      z-index: 1000;
      align-items: center;
      justify-content: center;
      display: none;
    }

    .modal-content {
      background: var(--color-secondary-surface);
      border-radius: var(--radius-large);
      box-shadow: var(--shadow-large);
      padding: var(--size-xxl);
      max-width: 600px;
      margin: 100px auto;
      position: relative;
    }

    .modal-close {
      margin-top: var(--size-l);
    }

    .modal-backdrop.visible {
      display: flex;
    }
  `];

  @property({ type: Boolean })
  visible = false;

  @property({ type: String })
  openLabel = "Open Modal";

  @property({ type: String })
  submitLabel = "Close Modal";

  override render(): TemplateResult {
    return html`
      <button @click="${() => this.visible = true}">${this.openLabel}</button>
      <div class="modal-backdrop ${this.visible ? "visible" : ""}" @click="${() => this.visible = false}">
        <div class="modal-content" @click="${(e: MouseEvent) => e.stopPropagation()}">
          <slot></slot>
          <button class="modal-close" @click="${() => this.visible = false}">${this.submitLabel}</button>
        </div>
      </div>
    `;
  }
}
