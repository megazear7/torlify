import { html, css, TemplateResult } from "lit";
import { customElement } from "lit/decorators.js";
import { parseRouteParams } from "../shared/util.route-params.js";
import { TorlifyAbstractNoBookPage } from "./abstract.no-book.js";
import "./element.book-list.js";

@customElement("torlify-home-page")
export class TorlifyHomePage extends TorlifyAbstractNoBookPage {
  static override styles = css`
    p {
      color: var(--color-1);
    }
  `;

  override params = parseRouteParams("/", window.location.pathname);

  override render(): TemplateResult {
    return html`
      <p>Home Page!</p>
      <torlify-book-list></torlify-book-list>
    `;
  }
}
