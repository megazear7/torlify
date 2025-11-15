import { html, css, LitElement, TemplateResult } from "lit";
import { customElement, property } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import { globalStyles } from "./styles.global";
import { dispatch, stopProp } from "./util.events";
import { ModelSubmitEvent } from "../shared/type.events";

@customElement("torlify-modal")
export class TorlifyModal extends LitElement {
  static override styles = [
    globalStyles,
    css`
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
        min-width: 30vw;
        max-width: 80vw;
        margin: 100px auto;
        position: relative;
      }

      .modal-close {
        margin-top: var(--size-l);
      }

      .modal-backdrop.visible {
        display: flex;
      }
    `,
  ];

  @property({ type: Boolean })
  visible = false;

  override render(): TemplateResult {
    return html`
      <slot name="open-button" @click="${(): void => this.open()}"></slot>
      <div
        class="${this.backdropClasses()}"
        @click="${(): void => this.close()}"
      >
        <div class="modal-content" @click="${stopProp}">
          <slot name="body"></slot>
          <slot
            name="submit-button"
            @click="${(): void => this.submit()}"
          ></slot>
        </div>
      </div>
    `;
  }

  backdropClasses(): ReturnType<typeof classMap> {
    return classMap({ "modal-backdrop": true, visible: this.visible });
  }

  open(): void {
    this.visible = true;
  }

  close(): void {
    this.visible = false;
  }

  submit(): void {
    this.visible = false;
    dispatch(this, ModelSubmitEvent());
  }
}
