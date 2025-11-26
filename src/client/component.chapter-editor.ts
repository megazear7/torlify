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
import { WarningEvent } from "./event.warning.js";
import "./component.auto-textarea.js";
import "./component.bar.js";

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
              <torlify-auto-textarea .value="${this.chapterContext.chapter.when}" @input="${this.save("when")}"></torlify-auto-textarea>
              <h4>Where</h4>
              <torlify-auto-textarea .value="${this.chapterContext.chapter.where}" @input="${this.save("where")}"></torlify-auto-textarea>
              <h4>What</h4>
              <torlify-auto-textarea .value="${this.chapterContext.chapter.what}" @input="${this.save("what")}"></torlify-auto-textarea>
              <h4>Why</h4>
              <torlify-auto-textarea .value="${this.chapterContext.chapter.why}" @input="${this.save("why")}"></torlify-auto-textarea>
              <h4>How</h4>
              <torlify-auto-textarea .value="${this.chapterContext.chapter.how}" @input="${this.save("how")}"></torlify-auto-textarea>
              <h4>Who</h4>
              <torlify-auto-textarea .value="${this.chapterContext.chapter.who}" @input="${this.save("who")}"></torlify-auto-textarea>
            </div>
            <div class="secondary-surface">
              <h4>Minimum Parts</h4>
              <input type="text" .value="${this.chapterContext.chapter.minParts}" @input="${this.save("minParts")}"></input>
              <h4>Maximum Parts</h4>
              <input type="text" .value="${this.chapterContext.chapter.maxParts}" @input="${this.save("maxParts")}"></input>
              <h4>Estimated Part Length in Words</h4>
              <input type="text" .value="${this.chapterContext.chapter.partLength}" @input="${this.save("partLength")}"></input>
            </div>
            <torlify-bar>
              <button @click=${() => dispatch(this, WarningEvent("Not implemented"))} class="standard-button">Generate Outline</button>
              <button @click=${() => dispatch(this, WarningEvent("Not implemented"))} class="standard-button">Generate Chapter</button>
              <button @click=${() => dispatch(this, WarningEvent("Not implemented"))} class="standard-button">Generate Audio</button>
              <button @click=${() => dispatch(this, WarningEvent("Not implemented"))} class="standard-button">Generate Everything</button>
            </torlify-bar>
            <div class="secondary-surface">
              <h4>Outline</h4>
              ${this.chapterContext.chapter.outline.map(
                (item, index) => html`
                  <torlify-auto-textarea
                    .value="${item}"
                    @input="${this.saveOutline(index)}"
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
      if (event.detail.value && this.chapterContext.chapter) {
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

  saveOutline(index: number): (event: CustomEvent) => void {
    return (event: CustomEvent): void => {
      if (event.detail.value && this.chapterContext.chapter) {
        const outline = [...this.chapterContext.chapter.outline];
        outline[index] = event.detail.value;
        const updateData = buildNestedObject(
          ChapterPartial,
          "outline",
          outline,
          { number: this.chapterContext.chapter!.number },
        );
        updateData.number = this.chapterContext.chapter!.number;
        dispatch(this, UpdateChapterEvent(updateData));
      }
    };
  }
}
