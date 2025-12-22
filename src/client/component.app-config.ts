import { css, html, LitElement, TemplateResult } from "lit";
import { customElement, property, query } from "lit/decorators.js";
import { globalStyles } from "./styles.global.js";
import { consume } from "@lit/context";
import { AppContext, appContext } from "./context.js";
import { LoadingStatus } from "../shared/type.loading.js";
import { InklifyModal } from "./component.modal.js";
import "./component.field.js";
import "./component.spinner.js";
import { appPingModelService } from "../shared/service.app-ping-model.js";
import { dispatch } from "./util.events.js";
import { SuccessEvent } from "./event.success.js";
import { WarningEvent } from "./event.warning.js";

@customElement("inklify-app-config")
export class InklifyAppConfig extends LitElement {
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
  public configElement!: InklifyModal;

  @property({ type: Boolean })
  public testConnectivityLoading = false;

  override render(): TemplateResult {
    return html`
      <button class="standard-button" @click=${this.openConfig()}>Configure</button>
      <inklify-modal id="config">
        <div slot="body">
          <h2>App Configuration</h2>
          <h3>Text Model Configuration</h3>
          <button
            class="standard-button small loading-button ${this.testConnectivityLoading ? "loading" : ""}"
            @click=${this.testConnectivity}
            ?disabled="${this.testConnectivityLoading}">
            <span>Test Connectivity</span>
            ${this.testConnectivityLoading
              ? html`
                  <inklify-spinner size="18"></inklify-spinner>
                `
              : ""}
          </button>
          <br />
          <inklify-field .generation=${false} property="app.model.text.name"></inklify-field>
          <inklify-field .generation=${false} property="app.model.text.modelName"></inklify-field>
          <inklify-field .generation=${false} property="app.model.text.endpoint"></inklify-field>
          <inklify-field
            property="app.model.text.cost.inputTokenCost"
            help="dollars per million tokens"
            type="number"></inklify-field>
          <inklify-field
            property="app.model.text.cost.outputTokenCost"
            help="dollars per million tokens"
            type="number"></inklify-field>
          <h3>Audio Model Configuration</h3>
          <inklify-field .generation=${false} property="app.model.audio.name"></inklify-field>
          <inklify-field .generation=${false} property="app.model.audio.modelName"></inklify-field>
          <p>
            <a href="https://www.openai.fm/">OpenAI Voice options</a>
          </p>
          <inklify-field .generation=${false} property="app.model.audio.voice"></inklify-field>
          <inklify-field .generation=${false} property="app.model.audio.endpoint"></inklify-field>
          <inklify-field
            property="app.model.audio.cost.inputTokenCost"
            help="dollars per million tokens"
            type="number"></inklify-field>
          <inklify-field
            property="app.model.audio.cost.outputTokenCost"
            help="dollars per million tokens"
            type="number"></inklify-field>
        </div>
      </inklify-modal>
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
      const errorObj = error as Error;
      console.error("Connectivity test failed:", error);
      dispatch(
        this,
        WarningEvent("Model did not respond.", `Ping to app text model failed with an error: ${errorObj.message}`),
      );
    } finally {
      this.testConnectivityLoading = false;
    }
  }
}
