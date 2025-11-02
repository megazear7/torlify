import { html, css, LitElement, TemplateResult } from "lit";
import { customElement, property } from "lit/decorators.js";
import { Health } from "../shared/type/health";

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
    this.test = Health.parse(await (await fetch("/health")).json()).healthy ? "Healthy" : "Unhealthy";
  }
}
