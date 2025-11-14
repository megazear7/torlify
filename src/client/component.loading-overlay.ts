import { html, css, LitElement, TemplateResult } from "lit";
import { customElement, property } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import { globalStyles } from "./styles.global";

@customElement("torlify-loading-overlay")
export class TorlifyLoadingOverlay extends LitElement {
  static override styles = [
    globalStyles,
    css`
      .loading-overlay {
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

      .loading-overlay.visible {
        display: flex;
      }
    `,
  ];

  @property({ type: Boolean })
  visible = false;

  override render(): TemplateResult {
    return html`
      <div class="${this.loadingOverlayClasses()}">
        <p>Loading...</p>
      </div>
    `;
  }

  loadingOverlayClasses(): ReturnType<typeof classMap> {
    return classMap({ "loading-overlay": true, visible: this.visible });
  }

  open(): void {
    this.visible = true;
  }

  close(): void {
    this.visible = false;
  }
}
