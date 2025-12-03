import { html, css, LitElement, TemplateResult } from "lit";
import { customElement, property } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import { globalStyles } from "./styles.global";
import { dispatch, stopProp } from "./util.events";
import { ModelSubmitEvent } from "./event.modal-submit.js";
import { ModelOpeningEvent } from "./event.modal-opening.js";
import { wait } from "../shared/util.wait";
import { ModelClosingEvent } from "./event.modal-closing";

const ANIMATION_SPEED = 300;

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
        max-width: 50vw;
        max-height: 80vh;
        overflow-y: scroll;
        margin: 100px auto;
        position: relative;
        opacity: 0;
        transform: translateY(-20vh);
      }

      .modal-backdrop.visible .modal-content {
        opacity: 1;
        transform: translateY(0);
      }

      .modal-close {
        margin-top: var(--size-l);
      }

      .modal-backdrop.visible,
      .modal-backdrop.opening {
        display: flex;
      }

      .modal-footer {
        display: flex;
        justify-content: flex-end;
        margin-top: var(--size-medium);
      }

      .modal-backdrop.opening .modal-content {
        animation: slideDown ${ANIMATION_SPEED}ms forwards;
      }

      .modal-backdrop.closing .modal-content {
        animation: slideDown ${ANIMATION_SPEED}ms reverse;
      }

      @keyframes slideDown {
        from {
          transform: translateY(-20vh);
          opacity: 0;
        }
        to {
          transform: translateY(0);
          opacity: 1;
        }
      }

      .modal-backdrop.opening {
        animation: fadeInBackdrop ${ANIMATION_SPEED}ms forwards;
      }

      .modal-backdrop.closing {
        animation: fadeInBackdrop ${ANIMATION_SPEED}ms reverse;
      }

      @keyframes fadeInBackdrop {
        from {
          background: rgba(0, 0, 0, 0);
        }
        to {
          background: rgba(0, 0, 0, 0.5);
        }
      }
    `,
  ];

  @property({ type: Boolean })
  visible = false;

  @property({ type: Boolean })
  opening = false;

  @property({ type: Boolean })
  closing = false;

  override render(): TemplateResult {
    return html`
      <slot
        name="open-button"
        @click="${(): Promise<void> => this.open()}"
      ></slot>
      <div
        class="${this.backdropClasses()}"
        @click="${(): Promise<void> => this.close()}"
      >
        <div class="modal-content" @click="${stopProp}">
          <slot name="body"></slot>
          <div class="modal-footer">
            <slot
              name="submit-button"
              @click="${(): void => this.submit()}"
            ></slot>
          </div>
        </div>
      </div>
    `;
  }

  backdropClasses(): ReturnType<typeof classMap> {
    return classMap({
      "modal-backdrop": true,
      opening: this.opening,
      closing: this.closing,
      visible: this.visible,
    });
  }

  async open(): Promise<void> {
    this.opening = true;
    dispatch(this, ModelOpeningEvent());
    await wait(ANIMATION_SPEED);
    this.opening = false;
    this.visible = true;
    window.document.body.style.overflow = "hidden";
  }

  async close(): Promise<void> {
    this.closing = true;
    dispatch(this, ModelClosingEvent());
    await wait(ANIMATION_SPEED);
    this.closing = false;
    this.visible = false;
    window.document.body.style.overflow = "auto";
  }

  submit(): void {
    this.visible = false;
    dispatch(this, ModelSubmitEvent());
  }
}
