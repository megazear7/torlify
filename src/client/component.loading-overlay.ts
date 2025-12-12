import { html, css, LitElement, TemplateResult } from "lit";
import { customElement, property, query } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import { globalStyles } from "./styles.global.js";
import { ANIMATION_SPEED_IN_MS } from "../shared/util.time.js";
import { BookContext, bookContext } from "./context.js";
import { LoadingStatus } from "../shared/type.loading.js";
import { consume } from "@lit/context";
import { overlayStyles } from "./styles.overlay.js";
import z from "zod";
import { checkedCircleIcon, circleIcon } from "./icons.js";

export const StepStatus = z.enum(["done", "progress", "pending"]);
export type StepStatus = z.infer<typeof StepStatus>;

export const Step = z.object({
  status: StepStatus,
  message: z.string(),
});
export type Step = z.infer<typeof Step>;

@customElement("torlify-loading-overlay")
export class TorlifyLoadingOverlay extends LitElement {
  static override styles = [
    globalStyles,
    overlayStyles,
    css`
      .loader-container {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .steps-container {
        position: fixed;
        top: 0;
        left: 0;
        padding: var(--size-xl);
      }

      .step-item {
        display: flex;
        align-items: center;
        gap: var(--size-medium);
        margin-bottom: var(--size-small);
        height: var(--size-large);
      }

      .step-icon {
        height: var(--size-large);
      }

      .step-icon {
        height: var(--size-large);
      }

      .step-item.done .step-icon {
        color: var(--color-success);
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
        content: "";
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
        content: "";
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
        0% {
          transform: rotate(0deg);
        }
        100% {
          transform: rotate(360deg);
        }
      }

      @keyframes spin-reverse {
        0% {
          transform: rotate(360deg);
        }
        100% {
          transform: rotate(0deg);
        }
      }

      @keyframes pulse {
        0%,
        100% {
          opacity: 0.3;
          transform: scale(0.8);
        }
        50% {
          opacity: 1;
          transform: scale(1.2);
        }
      }

      .loading-text {
        position: absolute;
        bottom: var(--size-xl);
        margin-top: var(--size-xl);
        font-size: calc(var(--font-medium) * 1);
        font-weight: 600;
        color: var(--color-primary-text);
        animation: text-glow 2s ease-in-out infinite alternate;
        text-align: center;
      }

      .loading-snippet {
        margin-top: var(--size-medium);
        font-size: calc(var(--font-medium) * 1.2);
        font-weight: 600;
        animation: text-glow 2s ease-in-out infinite alternate;
        height: var(--size-xxl);
      }

      .loading-snippet.fly-away {
        animation: fly-away 1s ease-in forwards;
      }

      @keyframes fly-away {
        0% {
          transform: translateX(0);
        }
        100% {
          transform: translateX(100vw);
        }
      }

      .loading-dots {
        position: absolute;
      }

      @keyframes text-glow {
        0% {
          text-shadow: 0 0 10px var(--color-1);
        }
        100% {
          text-shadow:
            0 0 20px var(--color-2),
            0 0 30px var(--color-1);
        }
      }
    `,
  ];

  @consume({ context: bookContext, subscribe: true })
  @property({ attribute: false })
  public bookContext: BookContext = {
    status: LoadingStatus.enum.idle,
  };

  @property({ type: String })
  message = "Loading";

  @property({ type: Boolean, attribute: false })
  private _visible = false;

  @property({ type: Number, attribute: false })
  private dotCount = 0;

  @property({ type: Array, attribute: false })
  private loadingSnippet: string[] = [];

  @property({ type: Array, attribute: false })
  private steps: Step[] = [];

  @query(".loading-snippet")
  private loadingSnippetElement!: HTMLElement;

  private dotInterval: ReturnType<typeof setTimeout> | null = null;
  private snippetInterval: ReturnType<typeof setTimeout> | null = null;

  override render(): TemplateResult {
    return html`
      <div class="${this.loadingOverlayClasses()}">
        <div class="steps-container">
          ${this.steps.map(
            (step, index) => html`
              <div class="step-item ${step.status === StepStatus.enum.done ? 'done' : ''}">
                <div class="step-icon">
                  ${step.status === StepStatus.enum.done ? html`${checkedCircleIcon}` : ''}
                  ${step.status === StepStatus.enum.progress ? html`<torlify-spinner size="20"></torlify-spinner>` : ''}
                  ${step.status === StepStatus.enum.pending ? html`${circleIcon}` : ''}
                </div>
                <div class="step-text">${index + 1}. ${step.message}</div>
              </div>
            `,
          )}
        </div>
        <div class="loader-container">
          <div class="loader"></div>
        </div>
        <div class="loading-text">
          <span>${this.message}</span>
        </div>
        <div class="loading-snippet">
          <span class="loading-snippet-text">${this.loadingSnippet}</span>
        </div>
      </div>
    `;
  }

  loadingOverlayClasses(): ReturnType<typeof classMap> {
    return classMap({ overlay: true, visible: this.visible });
  }

  set visible(value: boolean) {
    this._visible = value;
    if (this._visible) {
      this.open();
    } else {
      this.close();
    }
  }

  get visible(): boolean {
    return this._visible;
  }

  open(): void {
    this._visible = true;
    window.document.body.style.overflow = "hidden";
    this.dotInterval = setInterval(() => {
      this.dotCount = (this.dotCount + 1) % 4;
    }, ANIMATION_SPEED_IN_MS);
    if (this.bookContext.book) {
      setTimeout(() => {
        this.writeSnippet();
      }, 1000);
    }
  }

  writeSnippet(): void {
    let pause = false;
    this.loadingSnippet = [];
    let snippet: string | null = this.pickNewSnippet();
    setInterval(() => {
      // Reset snippet if complete
      if (!pause && snippet && this.loadingSnippet.length >= snippet.length) {
        pause = true;
        setTimeout(() => {
          this.loadingSnippetElement.classList.add("fly-away");
          setTimeout(() => {
            pause = false;
            this.loadingSnippet = [];
            snippet = this.pickNewSnippet();
            this.loadingSnippetElement.classList.remove("fly-away");
          }, 1000);
        }, 6000);
      }

      // Add next character
      if (!pause && snippet && this.loadingSnippet.length < snippet.length) {
        this.loadingSnippet.push(snippet[this.loadingSnippet.length]);
        this.requestUpdate();
      }
    }, 100);
  }

  private pickNewSnippet(): string {
    const messages = this.bookContext.book!.loadingMessages;
    const randomIndex = Math.floor(Math.random() * messages.length);
    return messages[randomIndex].replace("...", "") + "...";
  }

  close(): void {
    this._visible = false;
    clearInterval(this.dotInterval!);
    this.dotCount = 0;
    clearInterval(this.snippetInterval!);
    this.loadingSnippet = [];
    window.document.body.style.overflow = "";
  }
}
