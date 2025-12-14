import { css, html, TemplateResult } from "lit";
import { customElement } from "lit/decorators.js";
import { globalStyles } from "./styles.global.js";
import { TorlifyBookListProvider } from "./provider.book-list.js";
import "./component.book-list.js";
import "./component.app-config.js";
import "./component.book-table.js";
import "./component.prompt-logs.js";

@customElement("torlify-home-page")
export class TorlifyHomePage extends TorlifyBookListProvider {
  static override styles = [
    globalStyles,
    css`
      torlify-app-config,
      torlify-prompt-logs {
        display: inline-block;
      }
    `,
  ];

  override render(): TemplateResult {
    return html`
      <div class="container">
        <torlify-book-list></torlify-book-list>
        <h1>Home</h1>
        ${this.booksContext.books?.length === 0
          ? html`
              <p>
                Welcome to Torlify! Configure your AI connection below and then use the create button to get started.
              </p>
            `
          : html`
              <p>Select a book from the list to get started or update your AI model connection below.</p>
            `}
        <torlify-app-config></torlify-app-config>
        <torlify-prompt-logs></torlify-prompt-logs>
        <torlify-book-table></torlify-book-table>
      </div>
    `;
  }
}
