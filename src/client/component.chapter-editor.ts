import { consume } from "@lit/context";
import { css, html, LitElement, TemplateResult } from "lit";
import { customElement, property } from "lit/decorators.js";
import { chapterContext, ChapterContext } from "./context.book.js";
import { LoadingStatus } from "../shared/type.loading.js";
import { globalStyles } from "./styles.global.js";
import { ChapterPartial } from "../shared/type.book.js";
import { dispatch } from "./util.events.js";
import { buildNestedObject } from "../shared/util.property.js";
import { UpdateChapterEvent } from "./event.update-chapter.js";
import "./component.auto-textarea.js";

@customElement("torlify-chapter-editor")
export class TorlifyChapterEditor extends LitElement {
  static override styles = [
    globalStyles,
    css`
      :host {
        scroll-margin-top: var(--size-xl);
      }
    `,
  ];

  @consume({ context: chapterContext, subscribe: true })
  @property({ attribute: false })
  public chapterContext: ChapterContext = {
    status: LoadingStatus.enum.idle,
  };

  override render(): TemplateResult {
    return html`
      ${this.chapterContext.chapter
        ? html`
            <div class="secondary-surface">
              <h4>Chapter ${this.chapterContext.chapter.number}</h4>
              <torlify-auto-textarea
                cssClass="h2"
                .value="${this.chapterContext.chapter.title}"
                @input="${this.save("title")}"
              ></torlify-auto-textarea>
            </div>
            <div class="secondary-surface">
              <h4>When</h4>
              <torlify-auto-textarea .value="${this.chapterContext.chapter.when}"></torlify-auto-textarea>
              <h4>Where</h4>
              <torlify-auto-textarea .value="${this.chapterContext.chapter.where}"></torlify-auto-textarea>
              <h4>What</h4>
              <torlify-auto-textarea .value="${this.chapterContext.chapter.what}"></torlify-auto-textarea>
              <h4>Why</h4>
              <torlify-auto-textarea .value="${this.chapterContext.chapter.why}"></torlify-auto-textarea>
              <h4>How</h4>
              <torlify-auto-textarea .value="${this.chapterContext.chapter.how}"></torlify-auto-textarea>
              <h4>Who</h4>
              <torlify-auto-textarea .value="${this.chapterContext.chapter.who}"></torlify-auto-textarea>
            </div>
            <div class="secondary-surface">
              <h4>Minimum Parts</h4>
              <input type="text" .value="${this.chapterContext.chapter.minParts}"></input>
              <h4>Maximum Parts</h4>
              <input type="text" .value="${this.chapterContext.chapter.maxParts}"></input>
              <h4>Estimated Part Length in Words</h4>
              <input type="text" .value="${this.chapterContext.chapter.partLength}"></input>
            </div>
            <div class="secondary-surface">
              <h4>Outline</h4>
              ${this.chapterContext.chapter.outline.map(
                (item) => html`
                  <torlify-auto-textarea
                    .value="${item}"
                  ></torlify-auto-textarea>
                `,
              )}
            </div>
          `
        : html`<p>Loading chapter...</p>`}
    `;
  }

  save(prop: string): (event: CustomEvent) => void {
    return (event: CustomEvent): void => {
      if (event.detail.value) {
        const updateData = buildNestedObject(
          ChapterPartial,
          prop,
          event.detail.value,
          { number: this.chapterContext.chapter!.number },
        );
        updateData.number = this.chapterContext.chapter!.number;
        dispatch(this, UpdateChapterEvent(updateData));
      }
    };
  }
}
