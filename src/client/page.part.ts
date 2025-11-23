import { css, html, TemplateResult } from "lit";
import { customElement } from "lit/decorators.js";
import { parseRouteParams } from "../shared/util.route-params.js";
import { TorlifyPartProvider } from "./provider.part.js";
import { globalStyles } from "./styles.global.js";
import "./component.book-list.js";
import "./component.book-editor.js";
import "./component.chapter-list.js";
import "./component.chapter-editor.js";
import "./component.part-list.js";
import "./component.part-editor.js";
import "./component.pronunciations.js";
import "./component.references.js";
import { WarningEvent } from "./event.warning.js";
import { dispatch } from "./util.events.js";

@customElement("torlify-part-page")
export class TorlifyPartPage extends TorlifyPartProvider {
  params = parseRouteParams(
    "/book/:bookId/chapter/:chapterId/part/:partId",
    window.location.pathname,
  );

  static override styles = [
    globalStyles,
    css`
      torlify-part-list {
        scroll-margin-top: var(--size-xl);
      }
    `,
  ];

  override render(): TemplateResult {
    return html`
      <torlify-bookmark-tabs></torlify-bookmark-tabs>
      <div class="container">
        <torlify-book-list></torlify-book-list>
        <torlify-chapter-list></torlify-chapter-list>
        <torlify-book-editor></torlify-book-editor>
        <torlify-pronunciations></torlify-pronunciations>
        <torlify-references></torlify-references>
        <torlify-chapter-editor></torlify-chapter-editor>
        <torlify-part-list></torlify-part-list>
        <div class="button-bar">
          <button @click=${() => dispatch(this, WarningEvent("Not implemented"))} class="standard-button">Generate Part</button>
          <button @click=${() => dispatch(this, WarningEvent("Not implemented"))} class="standard-button">Edit Part</button>
          <button @click=${() => dispatch(this, WarningEvent("Not implemented"))} class="standard-button">Generate Audio</button>
        </div>
        <torlify-part-editor></torlify-part-editor>
      </div>
    `;
  }

  override async load(): Promise<void> {
    await super.load();
    this.partListElement.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}
