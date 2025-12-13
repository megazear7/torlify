import { css, html, LitElement, TemplateResult } from "lit";
import { customElement, property, query } from "lit/decorators.js";
import { globalStyles } from "./styles.global.js";
import { consume } from "@lit/context";
import { ChapterContext, chapterContext } from "./context.js";
import { LoadingStatus } from "../shared/type.loading.js";
import { TorlifyModal } from "./component.modal.js";
import { aiIcon, audioIcon, gearIcon, trashIcon } from "./icons.js";
import { WarningEvent } from "./event.warning.js";
import { dispatch } from "./util.events.js";
import "./component.field.js";
import "./component.spinner.js";
import "./component.book-field.js";

@customElement("torlify-chapter-title-modal")
export class TorlifyChapterTitleModal extends LitElement {
  static override styles = [
    globalStyles,
    css`
      :host {
        display: inline-block;
      }

      .open svg {
        color: var(--color-secondary-text);
        transition: var(--transition-all);
        display: inline-block;
      }

      .open:hover svg {
        color: var(--color-2);
        cursor: pointer;
      }
    `,
  ];

  @consume({ context: chapterContext, subscribe: true })
  @property({ attribute: false })
  public chapterContext: ChapterContext = {
    status: LoadingStatus.enum.idle,
  };

  @query("torlify-modal")
  public modal!: TorlifyModal;

  override render(): TemplateResult {
    return html`
      <button class="open" @click="${this.open()}">${gearIcon}</button>
      <torlify-modal id="config">
        <div slot="body">
          <h2>Title</h2>
          <torlify-field property="chapter.title" type="textarea" heading="h2"></torlify-field>
          <torlify-bar>
            <button class="standard-button" @click=${this.generate()}>${aiIcon} Generate</button>
            <button class="standard-button" @click=${this.listen()}>${audioIcon} Listen</button>
            <button class="standard-button" @click=${this.delete()}>${trashIcon} Delete</button>
          </torlify-bar>
        </div>
      </torlify-modal>
    `;
  }

  generate(): () => void {
    return (): void => {
      dispatch(this, WarningEvent("Generate title functionality not implemented yet."));
    };
  }

  listen(): () => void {
    return (): void => {
      dispatch(this, WarningEvent("Listen title functionality not implemented yet."));
    };
  }

  delete(): () => void {
    return (): void => {
      dispatch(this, WarningEvent("Delete title functionality not implemented yet."));
    };
  }

  open(): () => void {
    return (): void => {
      this.modal.open();
    };
  }
}
