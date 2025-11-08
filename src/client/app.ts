import { html, css, LitElement, TemplateResult } from "lit";
import { customElement, property } from "lit/decorators.js";
import { healthUtil } from "../shared/util.health.js";
import { healthApi } from "./api.health.js";

@customElement("torlify-app")
export class TorlifyApp extends LitElement {
  static override styles = css`
    p {
      color: var(--color-1);
    }
  `;

  @property()
  test = "Somebody";

  override render(): TemplateResult {
    return html`<p>${this.test}!</p>`;
  }

  override async connectedCallback(): Promise<void> {
    super.connectedCallback();
    console.log("Server healthy", (await healthApi()).healthy);
    console.log("Client healthy", healthUtil().healthy);
  }
}
