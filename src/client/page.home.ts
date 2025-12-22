import { css, html, TemplateResult } from "lit";
import { customElement } from "lit/decorators.js";
import { globalStyles } from "./styles.global.js";
import { InklifyBookListProvider } from "./provider.book-list.js";
import "./component.book-list.js";
import "./component.app-config.js";
import "./component.book-table.js";
import "./component.prompt-logs.js";

@customElement("inklify-home-page")
export class InklifyHomePage extends InklifyBookListProvider {
  static override styles = [
    globalStyles,
    css`
      inklify-app-config,
      inklify-prompt-logs {
        display: inline-block;
      }

      .title-container {
        display: flex;
        align-items: center;
        gap: var(--size-medium);
        margin-top: var(--size-medium);
      }

      .title-container h1 {
        margin: 0;
        font-size: calc(var(--font-large) * 1.5);
      }
    `,
  ];

  override render(): TemplateResult {
    return html`
      <div class="container">
        <inklify-book-list></inklify-book-list>
        <div class="title-container">
          <h1>Inklify</h1>
          <img src="/logo/logo-64x64.png" alt="Inklify Logo" />
        </div>
        ${this.booksContext.books?.length === 0
          ? html`
              <p>
                Welcome to Inklify! Configure your AI connection below and then use the create button to get started.
              </p>
            `
          : html`
              <p>Select a book from the list to get started or update your AI model connection below.</p>
            `}
        <inklify-app-config></inklify-app-config>
        <inklify-prompt-logs></inklify-prompt-logs>
        <inklify-book-table></inklify-book-table>
      </div>
    `;
  }
}
