import { css, html, LitElement, TemplateResult } from "lit";
import { customElement, property, query } from "lit/decorators.js";
import { globalStyles } from "./styles.global.js";
import { consume } from "@lit/context";
import { AppContext, appContext } from "./context.js";
import { LoadingStatus } from "../shared/type.loading.js";
import { TorlifyModal } from "./component.modal.js";
import "./component.field.js";
import "./component.spinner.js";
import { appPingModelService } from "../shared/service.app-ping-model.js";
import { dispatch } from "./util.events.js";
import { SuccessEvent } from "./event.success.js";
import { WarningEvent } from "./event.warning.js";

@customElement("torlify-app-config")
export class TorlifyAppConfig extends LitElement {
  static override styles = [
    globalStyles,
    css`
      .loading-button {
        display: flex;
        align-items: center;
        gap: var(--size-small);
      }

      .loading-button.loading:hover {
        background-color: var(--color-secondary-bold);
        box-shadow: var(--shadow-normal);
        transform: none;
      }
    `,
  ];

  @consume({ context: appContext, subscribe: true })
  @property({ attribute: false })
  public appContext: AppContext = {
    status: LoadingStatus.enum.idle,
  };

  @query("#config")
  public configElement!: TorlifyModal;

  @property({ type: Boolean })
  public testConnectivityLoading = false;

  override render(): TemplateResult {
    return html`
      <button class="standard-button" @click="${this.openConfig()}">Configure</button>
      <torlify-modal id="config">
        <div slot="body">
          <h2>App Configuration</h2>
          <h3>Text Model Configuration</h3>
          <button
            class="standard-button small loading-button ${this.testConnectivityLoading ? "loading" : ""}"
            @click="${this.testConnectivity}"
            ?disabled="${this.testConnectivityLoading}">
            <span>Test Connectivity</span>
            ${this.testConnectivityLoading
              ? html`
                  <torlify-spinner size="18"></torlify-spinner>
                `
              : ""}
          </button>
          <br />
          <torlify-field property="app.model.text.name"></torlify-field>
          <torlify-field property="app.model.text.modelName"></torlify-field>
          <torlify-field property="app.model.text.endpoint"></torlify-field>
          <torlify-field
            property="app.model.text.cost.inputTokenCost"
            help="per million tokens"
            type="number"></torlify-field>
          <torlify-field
            property="app.model.text.cost.outputTokenCost"
            help="per million tokens"
            type="number"></torlify-field>
          <h3>Audio Model Configuration</h3>
          <torlify-field property="app.model.audio.name"></torlify-field>
          <torlify-field property="app.model.audio.modelName"></torlify-field>
          <p>
            <a href="https://platform.openai.com/docs/guides/text-to-speech/voice-options#voice-options">
              OpenAI Voice options
            </a>
          </p>
          <torlify-field property="app.model.audio.voice"></torlify-field>
          <torlify-field property="app.model.audio.endpoint"></torlify-field>
          <torlify-field
            property="app.model.audio.cost.inputTokenCost"
            help="per million tokens"
            type="number"></torlify-field>
          <torlify-field
            property="app.model.audio.cost.outputTokenCost"
            help="per million tokens"
            type="number"></torlify-field>
        </div>
      </torlify-modal>
    `;
  }

  openConfig(): () => void {
    return (): void => {
      this.configElement.open();
    };
  }

  async testConnectivity(): Promise<void> {
    try {
      this.testConnectivityLoading = true;
      const response = await appPingModelService.fetch();
      dispatch(this, SuccessEvent(response));
    } catch (error) {
      console.error("Connectivity test failed:", error);
      dispatch(this, WarningEvent("Model did not respond."));
    } finally {
      this.testConnectivityLoading = false;
    }
  }
}
