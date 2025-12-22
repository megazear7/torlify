import { html, TemplateResult } from "lit";
import { customElement } from "lit/decorators.js";
import { parseRouteParams } from "../shared/util.route-params.js";
import { InklifyChapterProvider } from "./provider.chapter.js";
import { globalStyles } from "./styles.global.js";
import "./component.book-list.js";
import "./component.book-editor.js";
import "./component.book-summary.js";
import "./component.chapter-editor.js";
import "./component.part-list.js";
import "./component.pronunciations.js";
import "./component.references.js";
import "./component.characters.js";
import "./component.chapter-list.js";

@customElement("inklify-chapter-page")
export class InklifyChapterPage extends InklifyChapterProvider {
  params = parseRouteParams("/book/:bookId/chapter/:chapterId", window.location.pathname);

  static override styles = [globalStyles];

  override render(): TemplateResult {
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
        <inklify-chapter-editor></inklify-chapter-editor>
        <inklify-part-list></inklify-part-list>
      </div>
    `;
  }

  override async load(): Promise<void> {
    await super.load();
    this.chapterListElement.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }
}
