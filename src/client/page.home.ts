import { html, TemplateResult } from "lit";
import { customElement } from "lit/decorators.js";
import { parseRouteParams } from "../shared/util.route-params.js";
import { TorlifyBookListProvider } from "./provider.book-list.js";
import "./component.book-list.js";

@customElement("torlify-home-page")
export class TorlifyHomePage extends TorlifyBookListProvider {
  override params = parseRouteParams("/", window.location.pathname);

  override render(): TemplateResult {
    return html`
      <p>Home</p>
      <torlify-book-list></torlify-book-list>
    `;
  }
}
