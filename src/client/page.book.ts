import { html, TemplateResult } from "lit";
import { customElement } from "lit/decorators.js";
import { LoadingStatus } from "../shared/type.loading.js";
import { InklifyBookProvider } from "./provider.book.js";
import { globalStyles } from "./styles.global.js";
import "./component.book-list.js";
import "./component.book-editor.js";
import "./component.book-summary.js";
import "./component.bookmark-tabs.js";
import "./component.pronunciations.js";
import "./component.references.js";
import "./component.characters.js";
import "./component.chapter-list.js";

@customElement("inklify-book-page")
export class InklifyBookPage extends InklifyBookProvider {
  static override styles = [globalStyles];

  override render(): TemplateResult {
    if (this.bookContext.status === LoadingStatus.enum.error && !this.bookContext.book) {
      return html`
        <p>Book not found.</p>
      `;
    }

    return html`
      <inklify-bookmark-tabs></inklify-bookmark-tabs>
      <div class="container">
        <inklify-book-list></inklify-book-list>
        <inklify-book-summary></inklify-book-summary>
        <inklify-book-editor></inklify-book-editor>
        <inklify-pronunciations></inklify-pronunciations>
        <inklify-references></inklify-references>
        <inklify-characters></inklify-characters>
        <inklify-chapter-list></inklify-chapter-list>
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
