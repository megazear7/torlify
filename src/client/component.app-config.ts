import { css, html, LitElement, TemplateResult } from "lit";
import { customElement, property, query } from "lit/decorators.js";
import { globalStyles } from "./styles.global.js";
import { consume } from "@lit/context";
import { AppContext, appContext } from "./context.js";
import { LoadingStatus } from "../shared/type.loading.js";
import { TorlifyModal } from "./component.modal.js";
import "./component.app-field.js";

@customElement("torlify-app-config")
export class TorlifyAppConfig extends LitElement {
  static override styles = [globalStyles, css``];

  @consume({ context: appContext, subscribe: true })
  @property({ attribute: false })
  public appContext: AppContext = {
    status: LoadingStatus.enum.idle,
  };

  @query("#config")
  public configElement!: TorlifyModal;

  override render(): TemplateResult {
    return html`
      <button class="standard-button" @click="${this.openConfig()}">Outline</button>
      <torlify-modal id="config">
        <div slot="body">
          <h2>Book Configuration</h2>
          <torlify-app-field property="model.text.name"></torlify-app-field>
        </div>
      </torlify-modal>
    `;
  }

  openConfig(): () => void {
    return (): void => {
      this.configElement.open();
    };
  }
}
