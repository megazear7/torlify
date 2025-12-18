import { html, css, LitElement, TemplateResult } from "lit";
import { customElement, state } from "lit/decorators.js";
import { globalStyles } from "./styles.global.js";
import { overlayStyles } from "./styles.overlay.js";
import { xIcon } from "./icons.js";
import { PromptLog } from "../shared/type.prompt-log.js";

@customElement("torlify-prompt-logs")
export class TorlifyPromptLogs extends LitElement {
  static override styles = [
    globalStyles,
    overlayStyles,
    css`
      .prompt-logs-button {
        display: inline-block;
        padding: var(--size-small) var(--size-medium);
        background-color: var(--color-secondary-surface);
        color: var(--color-primary-text);
        border-radius: var(--radius-medium);
        cursor: pointer;
        transition: var(--transition-all);
        font-size: var(--font-small);
      }

      .prompt-logs-button:hover {
        background-color: var(--color-secondary-surface-hover);
      }

      .overlay-close {
        position: absolute;
        top: var(--size-xl);
        right: var(--size-xl);
        cursor: pointer;
        color: var(--color-primary-text-muted);
        transition: var(--transition-all);
      }

      .overlay-close svg {
        width: var(--size-xl);
        height: var(--size-xl);
      }

      .overlay-close:hover {
        color: var(--color-primary-text);
      }

      .prompt-logs-content {
        position: relative;
        top: 5vh;
        height: 100vh;
        width: 100vw;
        max-width: 1200px;
        display: flex;
        flex-direction: column;
        gap: var(--size-xl);
        align-items: center;
      }

      .prompt-logs-header {
        display: flex;
        justify-content: space-between;
        width: 100%;
        align-items: center;
      }

      .prompt-logs-list {
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        gap: var(--size-xxl);
        width: 100%;
        height: 100vh;
        overflow-y: auto;
        padding: var(--size-medium);
      }

      .prompt-log-item {
        background: var(--color-secondary-surface);
        border-radius: var(--radius-medium);
        padding: var(--size-medium);
      }

      .prompt-log-timestamp {
        font-size: var(--font-small);
        color: var(--color-primary-text-muted);
        margin-bottom: var(--size-small);
      }

      .prompt-log-input,
      .prompt-log-output {
        margin-top: var(--size-small);
      }

      .prompt-log-label {
        font-weight: bold;
        font-size: var(--font-large);
        margin-bottom: var(--size-small);
      }

      .prompt-log-json {
        background: var(--color-code-background);
        padding: var(--size-small);
        border-radius: var(--radius-small);
        font-family: monospace;
        font-size: var(--font-small);
        white-space: pre-wrap;
        overflow-y: auto;
      }

      .no-logs {
        text-align: center;
        font-style: italic;
        padding: var(--size-xl);
      }
    `,
  ];

  @state()
  private logs: PromptLog[] = [];

  @state()
  private visible = false;

  override render(): TemplateResult {
    return html`
      <button class="standard-button prompt-logs-button" @click=${this.open}>Prompt Logs (${this.logs.length})</button>
      <div class="overlay ${this.visible ? "visible" : ""}">
        <div class="overlay-close" @click=${this.close}>${xIcon}</div>
        <div class="prompt-logs-content">
          <div class="prompt-logs-header">
            <h2>Prompt Logs</h2>
          </div>
          <div class="prompt-logs-list">
            ${this.logs.length === 0
              ? html`
                  <div class="no-logs">No prompt logs found</div>
                `
              : this.logs.map(
                  (log) => html`
                    <div class="prompt-log-item">
                      <div class="prompt-log-timestamp">${new Date(log.timestamp).toLocaleString()}</div>
                      <div class="prompt-log-input">
                        <div class="prompt-log-label">Input</div>
                        <div class="prompt-log-json">${JSON.stringify(log.input, null, 2)}</div>
                      </div>
                      ${log.output
                        ? html`
                            <div class="prompt-log-output">
                              <div class="prompt-log-label">Output</div>
                              <div class="prompt-log-json">${JSON.stringify(log.output, null, 2)}</div>
                            </div>
                          `
                        : ""}
                    </div>
                  `,
                )}
          </div>
        </div>
      </div>
    `;
  }

  override connectedCallback(): void {
    super.connectedCallback();
    this.fetchLogs();
    document.addEventListener("keydown", this.handleKeyDown);
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    document.removeEventListener("keydown", this.handleKeyDown);
  }

  private async fetchLogs(): Promise<void> {
    try {
      const response = await fetch("/api/prompt-logs");
      if (response.ok) {
        this.logs = await response.json();
      } else {
        console.error("Failed to fetch prompt logs");
      }
    } catch (error) {
      console.error("Error fetching prompt logs:", error);
    }
  }

  private open = (): void => {
    this.visible = true;
    window.document.body.style.overflow = "hidden";
  };

  private close = (): void => {
    this.visible = false;
    window.document.body.style.overflow = "auto";
  };

  private handleKeyDown = (event: KeyboardEvent): void => {
    if (event.key === "Escape" && this.visible) {
      this.close();
    }
  };
}
