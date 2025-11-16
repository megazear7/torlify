import { html, TemplateResult } from "lit";
import { customElement } from "lit/decorators.js";
import { TorlifyBookListProvider } from "./provider.book-list.js";
import "./component.book-list.js";
import { globalStyles } from "./styles.global.js";

@customElement("torlify-home-page")
export class TorlifyHomePage extends TorlifyBookListProvider {
  static override styles = [globalStyles];

  override render(): TemplateResult {
    return html`
      <div class="container">
        <torlify-book-list></torlify-book-list>
        <h1>Home</h1>
        <p>Welcome to Torlify! Select a book from the list to get started.</p>
      </div>
    `;
  }
}
