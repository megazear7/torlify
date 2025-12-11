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
  static override styles = [
    globalStyles,
    pillStyles,
    css`
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
        cursor: pointer;
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
    `,
  ];

  @consume({ context: booksContext, subscribe: true })
  @property({ attribute: false })
  booksContext: BooksContext = {
    status: LoadingStatus.enum.idle,
  };

  @property()
  sortColumn: string = "title";

  @property()
  sortDirection: "asc" | "desc" = "asc";

  private handleSort(column: string) {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === "asc" ? "desc" : "asc";
    } else {
      this.sortColumn = column;
      this.sortDirection = "asc";
    }
    this.requestUpdate();
  }

  private getSortIndicator(column: string): string {
    if (this.sortColumn !== column) return "";
    return this.sortDirection === "asc" ? " ↑" : " ↓";
  }

  override render(): TemplateResult {
    const sortedBooks = this.booksContext.books
      ? [...this.booksContext.books].sort((a, b) => {
          const aVal = a[this.sortColumn as keyof typeof a];
          const bVal = b[this.sortColumn as keyof typeof b];
          if (typeof aVal === 'string') {
            return this.sortDirection === 'asc'
              ? (aVal as string).localeCompare(bVal as string)
              : (bVal as string).localeCompare(aVal as string);
          } else {
            return this.sortDirection === 'asc'
              ? (aVal as number) - (bVal as number)
              : (bVal as number) - (aVal as number);
          }
        })
      : [];

    return html`
      <table>
        <thead>
          <tr>
            <th @click=${() => this.handleSort('title')}>Title${this.getSortIndicator('title')}</th>
            <th @click=${() => this.handleSort('chapterCount')}>Chapters${this.getSortIndicator('chapterCount')}</th>
            <th @click=${() => this.handleSort('wordCount')}>Words${this.getSortIndicator('wordCount')}</th>
            <th @click=${() => this.handleSort('tokenCount')}>Tokens${this.getSortIndicator('tokenCount')}</th>
            <th @click=${() => this.handleSort('cost')}>Cost${this.getSortIndicator('cost')}</th>
          </tr>
        </thead>
        <tbody>
          ${sortedBooks.length > 0
            ? sortedBooks.map(
                (book) => html`
                  <tr>
                    <td><a href="/book/${book.id}">${book.title}</a></td>
                    <td>${formatNumber(book.chapterCount, { decimals: 0 })}</td>
                    <td>${formatNumber(book.wordCount, { decimals: 0 })}</td>
                    <td>${formatNumber(book.tokenCount, { decimals: 0 })}</td>
                    <td>${formatNumber(book.cost, { decimals: 2, currency: "$", currencyPosition: "before" })}</td>
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
