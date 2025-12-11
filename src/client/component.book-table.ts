import { css, html, LitElement, TemplateResult } from "lit";
import { customElement, property } from "lit/decorators.js";
import { LoadingStatus } from "../shared/type.loading.js";
import { BooksContext, booksContext } from "./context.js";
import { consume } from "@lit/context";
import { globalStyles } from "./styles.global.js";
import { pillStyles } from "./styles.pill.js";
import { formatNumber } from "../shared/util.number.js";

@customElement("torlify-book-table")
export class TorlifyBookTable extends LitElement {
  static override styles = [globalStyles, pillStyles, css`
    table {
      width: 100%;
      border-collapse: collapse;
      background-color: var(--color-secondary-surface);
      border-radius: var(--radius-medium);
      overflow: hidden;
      box-shadow: var(--shadow-normal);
      margin: var(--size-medium) 0;
    }

    th {
      background-color: var(--color-secondary-bold);
      color: var(--color-secondary-text);
      padding: var(--size-medium);
      text-align: left;
      font-weight: bold;
      font-size: var(--font-small);
    }

    td {
      padding: var(--size-medium);
      border-bottom: 1px solid var(--color-secondary-surface-active);
      color: var(--color-primary-text);
      font-size: var(--font-medium);
    }

    tbody tr {
      transition: var(--transition-all);
    }

    tbody tr:hover {
      background-color: var(--color-secondary-surface-active);
      transform: var(--transform-hover);
      box-shadow: var(--shadow-hover);
    }

    th:last-child,
    td:last-child {
      text-align: right;
    }

    p {
      color: var(--color-error);
      text-align: center;
      padding: var(--size-large);
    }

    a {
      color: var(--color-primary-text);
      text-decoration: none;
      transition: var(--transition-all);
    }

    a:hover {
      color: var(--color-1);
    }
  `];

  @consume({ context: booksContext, subscribe: true })
  @property({ attribute: false })
  booksContext: BooksContext = {
    status: LoadingStatus.enum.idle,
  };

  override render(): TemplateResult {
    return html`
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Chapters</th>
            <th>Words</th>
            <th>Tokens</th>
            <th>Cost (USD)</th>
          </tr>
        </thead>
        <tbody>
          ${this.booksContext.books
            ? this.booksContext.books.map(
                (book) => html`
                  <tr>
                    <td><a href="/book/${book.id}">${book.title}</a></td>
                    <td>${formatNumber(book.chapterCount, { decimals: 0 })}</td>
                    <td>${formatNumber(book.wordCount, { decimals: 0 })}</td>
                    <td>${formatNumber(book.tokenCount, { decimals: 0 })}</td>
                    <td>${formatNumber(book.cost, { decimals: 4, currency: "$", currencyPosition: "before" })}</td>
                  </tr>
                `,
              )
            : html`
                <p>Error loading books.</p>
              `}
        </tbody>
      </table>
    `;
  }
}
