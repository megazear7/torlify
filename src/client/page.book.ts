import { html, TemplateResult } from "lit";
import { customElement } from "lit/decorators.js";
import { LoadingStatus } from "../shared/type.loading.js";
import { TorlifyBookProvider } from "./provider.book.js";
import { globalStyles } from "./styles.global.js";
import "./component.book-list.js";
import "./component.book-editor.js";
import "./component.chapter-list.js";
import "./component.bookmark-tabs.js";
import "./component.pronunciations.js";
import "./component.references.js";
import "./component.characters.js";

@customElement("torlify-book-page")
export class TorlifyBookPage extends TorlifyBookProvider {
  static override styles = [globalStyles];

  override render(): TemplateResult {
    if (
      this.bookContext.status === LoadingStatus.enum.error &&
      !this.bookContext.book
    ) {
      return html`<p>Book not found.</p>`;
    }

    return html`
      <torlify-bookmark-tabs></torlify-bookmark-tabs>
      <div class="container">
        <torlify-book-list></torlify-book-list>
        <torlify-chapter-list></torlify-chapter-list>
        <torlify-book-editor></torlify-book-editor>
        <torlify-pronunciations></torlify-pronunciations>
        <torlify-references></torlify-references>
        <torlify-characters></torlify-characters>
      </div>
    `;
  }

  override async load(): Promise<void> {
    await super.load();
    this.bookListElement.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }
}
