import { css, html, TemplateResult } from "lit";
import { customElement } from "lit/decorators.js";
import { parseRouteParams } from "../shared/util.route-params.js";
import { InklifyPartProvider } from "./provider.part.js";
import { globalStyles } from "./styles.global.js";
import "./component.book-list.js";
import "./component.book-editor.js";
import "./component.book-summary.js";
import "./component.chapter-editor.js";
import "./component.part-list.js";
import "./component.part-editor.js";
import "./component.pronunciations.js";
import "./component.references.js";
import "./component.characters.js";
import "./component.chapter-list.js";

@customElement("inklify-part-page")
export class InklifyPartPage extends InklifyPartProvider {
  params = parseRouteParams("/book/:bookId/chapter/:chapterId/part/:partId", window.location.pathname);

  static override styles = [
    globalStyles,
    css`
      inklify-part-list {
        scroll-margin-top: var(--size-xl);
      }
    `,
  ];

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
        <inklify-part-editor></inklify-part-editor>
      </div>
    `;
  }

  override async load(): Promise<void> {
    await super.load();
    this.partListElement.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}
