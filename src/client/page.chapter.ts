import { html, TemplateResult } from "lit";
import { customElement } from "lit/decorators.js";
import { parseRouteParams } from "../shared/util.route-params.js";
import { TorlifyChapterProvider } from "./provider.chapter.js";
import { globalStyles } from "./styles.global.js";
import "./component.book-list.js";
import "./component.book-editor.js";
import "./component.chapter-list.js";
import "./component.chapter-editor.js";
import "./component.part-list.js";
import "./component.pronunciations.js";
import "./component.references.js";
import "./component.characters.js";

@customElement("torlify-chapter-page")
export class TorlifyChapterPage extends TorlifyChapterProvider {
  params = parseRouteParams("/book/:bookId/chapter/:chapterId", window.location.pathname);

  static override styles = [globalStyles];

  override render(): TemplateResult {
    return html`
      <torlify-bookmark-tabs></torlify-bookmark-tabs>
      <div class="container">
        <torlify-book-list></torlify-book-list>
        <torlify-chapter-list></torlify-chapter-list>
        <torlify-book-editor></torlify-book-editor>
        <torlify-pronunciations></torlify-pronunciations>
        <torlify-references></torlify-references>
        <torlify-characters></torlify-characters>
        <torlify-chapter-editor></torlify-chapter-editor>
        <torlify-part-list></torlify-part-list>
      </div>
    `;
  }

  override async load(): Promise<void> {
    await super.load();
    this.chapterEditorElement.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }
}
