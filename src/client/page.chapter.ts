import { css, html, TemplateResult } from "lit";
import { customElement, query } from "lit/decorators.js";
import { parseRouteParams } from "../shared/util.route-params.js";
import { TorlifyChapterProvider } from "./provider.chapter.js";
import "./component.book-list.js";
import "./component.book-editor.js";
import "./component.chapter-list.js";
import "./component.chapter-editor.js";
import "./component.part-list.js";
import { globalStyles } from "./styles.global.js";
import { TorlifyChapterEditor } from "./component.chapter-editor.js";

@customElement("torlify-chapter-page")
export class TorlifyChapterPage extends TorlifyChapterProvider {
  params = parseRouteParams(
    "/book/:bookId/chapter/:chapterId",
    window.location.pathname,
  );

  static override styles = [globalStyles, css`
    torlify-part-list {
      torlify-chapter-editor: var(--size-xl);
    }
  `];

  @query("torlify-chapter-editor")
  chapterEditorElement!: TorlifyChapterEditor;

  override render(): TemplateResult {
    return html`
      <div class="container">
        <torlify-book-list></torlify-book-list>
        <torlify-chapter-list></torlify-chapter-list>
        <torlify-book-editor></torlify-book-editor>
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
