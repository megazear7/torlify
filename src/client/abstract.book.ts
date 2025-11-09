import { provide } from '@lit/context';
import { LitElement } from "lit";
import { property } from "lit/decorators.js";
import { BookContext, bookContext, BooksContext, booksContext } from "./context.book.js";
import { bookApi, booksApi } from './api.book.js';
import { LoadingStatus } from '../shared/type.loading.js';
import { parseRouteParams } from '../shared/util.route-params.js';
import "./element.book-editor.js"

export abstract class TorlifyAbstractBookPage extends LitElement {
  params = parseRouteParams("/book/:bookId", window.location.pathname);

  @provide({context: booksContext})
  @property({attribute: false})
  booksContext: BooksContext = {
    status: LoadingStatus.enum.idle,
  }

  @provide({context: bookContext})
  @property({attribute: false})
  bookContext: BookContext = {
    status: LoadingStatus.enum.idle,
  }

  override async connectedCallback(): Promise<void> {
    super.connectedCallback();

    this.booksContext = {
        books: await booksApi(),
        status: LoadingStatus.enum.success,
    };

    this.bookContext = {
        book: await bookApi(this.params.bookId),
        status: LoadingStatus.enum.success,
    };
  }
}
