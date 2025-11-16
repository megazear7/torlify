import { html, css, LitElement, TemplateResult } from "lit";
import { customElement, property } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import { globalStyles } from "./styles.global.js";

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
        background: rgba(0, 0, 0, 0.6);
        backdrop-filter: blur(5px);
        z-index: 10000;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        opacity: 0;
        transition: opacity var(--time-normal) ease-in-out;
        pointer-events: none;
      }

      .loading-overlay.visible {
        opacity: 1;
        pointer-events: auto;
      }

      .loader-container {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .loader {
        width: 80px;
        height: 80px;
        border: 6px solid transparent;
        border-top: 6px solid var(--color-1);
        border-right: 6px solid var(--color-2);
        border-radius: 50%;
        animation: spin 1.2s linear infinite;
        position: relative;
      }

      .loader::before {
        content: '';
        position: absolute;
        top: -6px;
        left: -6px;
        right: -6px;
        bottom: -6px;
        border: 6px solid transparent;
        border-bottom: 6px solid var(--color-1);
        border-left: 6px solid var(--color-2);
        border-radius: 50%;
        animation: spin-reverse 1.5s linear infinite;
      }

      .loader::after {
        content: '';
        position: absolute;
        top: 10px;
        left: 10px;
        right: 10px;
        bottom: 10px;
        background: linear-gradient(135deg, var(--color-1), var(--color-2));
        border-radius: 50%;
        animation: pulse 2s ease-in-out infinite;
      }

      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }

      @keyframes spin-reverse {
        0% { transform: rotate(360deg); }
        100% { transform: rotate(0deg); }
      }

      @keyframes pulse {
        0%, 100% { opacity: 0.3; transform: scale(0.8); }
        50% { opacity: 1; transform: scale(1.2); }
      }

      .loading-text {
        margin-top: var(--size-xl);
        font-size: calc(var(--font-medium) * 1.5);
        font-weight: 600;
        color: var(--color-primary-text);
        animation: text-glow 2s ease-in-out infinite alternate;
        text-align: center;
      }

      @keyframes text-glow {
        0% { text-shadow: 0 0 10px var(--color-1); }
        100% { text-shadow: 0 0 20px var(--color-2), 0 0 30px var(--color-1); }
      }

      .particles {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        overflow: hidden;
      }

      .particle {
        position: absolute;
        width: 4px;
        height: 4px;
        background: var(--color-1);
        border-radius: 50%;
        animation: float 3s ease-in-out infinite;
      }

      .particle:nth-child(2n) {
        background: var(--color-2);
        animation-delay: 1s;
        animation-duration: 4s;
      }

      .particle:nth-child(3n) {
        animation-delay: 2s;
        animation-duration: 5s;
      }

      @keyframes float {
        0%, 100% { transform: translateY(100vh) rotate(0deg); opacity: 0; }
        50% { transform: translateY(50vh) rotate(180deg); opacity: 1; }
      }
    `,
  ];

  @property({ type: Boolean })
  visible = false;

  override render(): TemplateResult {
    return html`
      <div class="${this.loadingOverlayClasses()}">
        <div class="loader-container">
          <div class="loader"></div>
          <div class="particles">
            ${Array.from({ length: 20 }, () => html`
              <div class="particle" style="left: ${Math.random() * 100}%; animation-delay: ${Math.random() * 3}s;"></div>
            `)}
          </div>
        </div>
        <div class="loading-text">Loading...</div>
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
