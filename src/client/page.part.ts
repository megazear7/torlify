import { html, TemplateResult } from "lit";
import { customElement, query } from "lit/decorators.js";
import { parseRouteParams } from "../shared/util.route-params.js";
import { TorlifyPartProvider } from "./provider.part.js";
import "./component.book-list.js";
import "./component.book-editor.js";
import "./component.chapter-list.js";
import "./component.chapter-editor.js";
import "./component.part-list.js";
import "./component.part-editor.js";
import { globalStyles } from "./styles.global.js";
import { TorlifyPartList } from "./component.part-list.js";

@customElement("torlify-part-page")
export class TorlifyPartPage extends TorlifyPartProvider {
  params = parseRouteParams(
    "/book/:bookId/chapter/:chapterId/part/:partId",
    window.location.pathname,
  );

  @query("torlify-part-list")
  partListElement!: TorlifyPartList;

  static override styles = [globalStyles];

  override render(): TemplateResult {
    return html`
      <div class="container">
        <torlify-book-list></torlify-book-list>
        <torlify-chapter-list></torlify-chapter-list>
        <torlify-book-editor></torlify-book-editor>
        <torlify-chapter-editor></torlify-chapter-editor>
        <torlify-part-list></torlify-part-list>
        <torlify-part-editor></torlify-part-editor>
      </div>
    `;
  }

  override async load(): Promise<void> {
    await super.load();
    this.partListElement.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}
