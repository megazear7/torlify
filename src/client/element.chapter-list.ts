import {consume} from '@lit/context';
import { html, css, LitElement, TemplateResult } from "lit";
import { customElement, property } from "lit/decorators.js";
import { BookContext, bookContext } from "./context.book.js";
import { LoadingStatus } from '../shared/type.loading.js';

@customElement("torlify-chapter-list")
export class TorlifyChapterList extends LitElement {
  static override styles = css`
    p {
      color: var(--color-1);
    }
  `;

  @consume({context: bookContext, subscribe: true})
  @property({attribute: false})
  public bookContext: BookContext = {
      status: LoadingStatus.enum.idle,
  };

  override render(): TemplateResult {
    const book = this.bookContext.book;

    if (!book) {
      return html`<p>No book selected.</p>`;
    }

    return html`
      <ul>
        <li><a href="/">Home</a></li>
        ${book.chapters.map((chapter, index) => html`
          <li><a href="/book/${book.id}/chapter/${index + 1}">${chapter.title}</a></li>
        `) ?? html`<li>No chapters found</li>`}
      </ul>
    `;
  }
}
