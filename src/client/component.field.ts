import { css, html, LitElement, TemplateResult } from "lit";
import { customElement, property, query, state } from "lit/decorators.js";
import { globalStyles } from "./styles.global.js";
import { consume } from "@lit/context";
import { AppContext, appContext, BookContext, bookContext, chapterContext, ChapterContext } from "./context.js";
import { LoadingStatus } from "../shared/type.loading.js";
import { SaveEvent } from "./event.save.js";
import { dispatch } from "./util.events.js";
import { DebounceHandler } from "./util.debounce.js";
import { Book, BookPartial, Chapter, ChapterPartial } from "../shared/type.book.js";
import { AppConfig, AppConfigPartial } from "../shared/type.app.js";
import { buildNestedObject } from "../shared/util.property.js";
import { mergeBookProperties } from "../shared/util.merge-book.js";
import { updateBookService } from "../shared/service.update-book.js";
import { mergeAppProperties } from "../shared/util.merge-app.js";
import { updateAppService } from "../shared/service.update-app.js";
import { aiIcon, infoIcon } from "./icons.js";
import { WarningEvent } from "./event.warning.js";
import { updateChapterService } from "../shared/service.update-chapter.js";
import { InklifyModal } from "./component.modal.js";
import { generateBookFieldService } from "../shared/service.generate-book-field.js";
import z from "zod";
import { InklifyAutoTextarea } from "./component.auto-textarea.js";

export const FieldType = z.enum(["input", "textarea", "number", "boolean"]);
export type FieldType = z.infer<typeof FieldType>;

@customElement("inklify-field")
export class InklifyField extends LitElement {
  static override styles = [
    globalStyles,
    css`
      label {
        display: flex;
        align-items: center;
        gap: var(--size-small);
        margin-bottom: var(--size-small);
        color: var(--color-secondary-text-muted);
        opacity: 0.8;
        font-style: italic;
      }

      label .field-help {
        display: flex;
        align-items: center;
      }

      .field {
        position: relative;
      }

      .generate {
        position: absolute;
        top: calc(-1 * var(--size-medium));
        right: calc(-1 * var(--size-medium));
        padding: var(--size-small);
        background: var(--color-secondary-surface-active);
        border-radius: 50%;
        opacity: 0;
        transition: var(--transition-all);
        box-shadow: var(--shadow-normal);
        color: var(--color-secondary-text-muted);
        cursor: pointer;
      }

      .field:hover .generate {
        opacity: 1;
      }

      .generate:hover {
        background: var(--color-2);
        box-shadow: var(--shadow-hover);
        color: var(--color-secondary-text);
      }

      .generate-button {
        cursor: pointer;
      }

      .generate-button.loading {
        background: var(--color-secondary-surface-active) !important;
        box-shadow: var(--shadow-normal) !important;
        transform: none !important;
      }

      .invalid input,
      .invalid inklify-auto-textarea {
        border: none !important;
        box-shadow: 0 0 0 1px var(--color-danger) !important;
      }
    `,
  ];

  @consume({ context: appContext, subscribe: true })
  @property({ attribute: false })
  public appContext: AppContext = {
    status: LoadingStatus.enum.idle,
  };

  @consume({ context: bookContext, subscribe: true })
  @property({ attribute: false })
  public bookContext: BookContext = {
    status: LoadingStatus.enum.idle,
  };

  @consume({ context: chapterContext, subscribe: true })
  @property({ attribute: false })
  public chapterContext: ChapterContext = {
    status: LoadingStatus.enum.idle,
  };

  @property({ type: String })
  public type: FieldType = FieldType.enum.input;

  @property({ type: String })
  public property: string = "";

  @property({ type: String })
  public label: string = "";

  @property({ type: Boolean })
  public hideLabel: boolean = false;

  @property({ type: String })
  public help: string = "";

  @property({ type: String })
  public heading: "h2" | "" = "";

  @property({ type: Boolean })
  public generation: boolean = true;

  @property({ type: Number })
  public min?: number;

  @property({ type: Number })
  public max?: number;

  @property({ type: Number })
  public step?: number;

  @state()
  public generationLoading: boolean = false;

  @state()
  public invalid: boolean = false;

  @query("inklify-modal")
  private modal!: InklifyModal;

  @query("#generation-instructions")
  private generationInstructions!: HTMLTextAreaElement;

  private debounceHandler = new DebounceHandler();

  override render(): TemplateResult {
    switch (this.type) {
      case FieldType.enum.input:
        return this.input();
      case FieldType.enum.number:
        return this.number();
      case FieldType.enum.textarea:
        return this.textarea();
      case FieldType.enum.boolean:
        return this.boolean();
      default:
        throw new Error(`Unknown field type: ${this.type}`);
    }
  }

  input(): TemplateResult {
    return html`
      ${this.hideLabel
        ? html``
        : html`
            <label for="${this.propertyId}">${this.labelWithFallbackTemplate()}${this.renderHelp()}</label>
          `}
      <div class="field ${this.invalid ? "invalid" : ""}">
        <input type="text" id="${this.propertyId}" .value="${this.value}" @input=${this.save()} />
        ${this.renderGenerate()}
      </div>
    `;
  }

  number(): TemplateResult {
    return html`
      ${this.hideLabel
        ? html``
        : html`
            <label for="${this.propertyId}">${this.labelWithFallbackTemplate()}${this.renderHelp()}</label>
          `}
      <div class="field ${this.invalid ? "invalid" : ""}">
        <input
          type="number"
          id="${this.propertyId}"
          .value="${this.value}"
          @input=${this.save()}
          min=${this.min !== undefined ? this.min : 0}
          max=${this.max !== undefined ? this.max : ""}
          step=${this.step !== undefined ? this.step : 1} />
      </div>
    `;
  }

  textarea(): TemplateResult {
    return html`
      ${this.hideLabel
        ? html``
        : html`
            <label for="${this.propertyId}">${this.labelWithFallbackTemplate()}${this.renderHelp()}</label>
          `}
      <div class="field ${this.invalid ? "invalid" : ""}">
        <inklify-auto-textarea
          heading=${this.heading}
          .value=${this.value}
          @input=${this.save()}></inklify-auto-textarea>
        ${this.renderGenerate()}
      </div>
    `;
  }

  boolean(): TemplateResult {
    return html`
      ${this.hideLabel
        ? html``
        : html`
            <label for="${this.propertyId}">${this.labelWithFallbackTemplate()}${this.renderHelp()}</label>
          `}
      <div class="field ${this.invalid ? "invalid" : ""}">
        <inklify-checkbox
          .checked="${!!this.value}"
          text=${this.labelWithFallback()}
          @change=${this.save()}></inklify-checkbox>
      </div>
    `;
  }

  renderGenerate(): TemplateResult {
    if (!this.generation) return html``;
    return html`
      <button class="generate" @click=${this.openGenerationModal()}>${aiIcon}</button>
      <inklify-modal>
        <div slot="body">
          <h3>Generate Field Content</h3>
          <p>Generate for the ${this.labelWithFallback()} Field</p>
          <h6>Additional Instructions (optional)</h6>
          <inklify-auto-textarea id="generation-instructions"></inklify-auto-textarea>
          <inklify-bar>
            <button
              class="standard-button generate-button ${this.generationLoading ? "loading" : ""}"
              @click=${this.generate()}>
              ${this.generationLoading
                ? html`
                    <inklify-spinner></inklify-spinner>
                  `
                : ""}
              ${this.value ? "Regenerate" : "Generate"}
            </button>
          </inklify-bar>
        </div>
      </inklify-modal>
    `;
  }

  renderHelp(): TemplateResult {
    if (this.help) {
      return html`
        <inklify-tooltip content=${this.help} offsetY="90">${infoIcon}</inklify-tooltip>
      `;
    }
    return html``;
  }

  labelWithFallback(): string {
    if (this.label) return this.label;
    // Derive label from property
    const parts = this.property.split(".");
    const lastPart = parts[parts.length - 1];
    // Convert camelCase or snake_case to Title Case
    const title = lastPart
      .replace(/([A-Z])/g, " $1")
      .replace(/_/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
    return title;
  }

  labelWithFallbackTemplate(): TemplateResult {
    return html`
      <span>${this.labelWithFallback()}</span>
    `;
  }

  openGenerationModal(): () => void {
    return (): void => {
      this.modal.open();
    };
  }

  generate(): () => void {
    return async (): Promise<void> => {
      const property = this.contextualProperty;
      const instructions = this.generationInstructions.value;
      const book = this.bookContext.book?.id;

      if (!book) {
        dispatch(this, WarningEvent("No book context available for generation"));
        return;
      }

      this.generationLoading = true;
      await generateBookFieldService.fetch({ property, instructions, book });
      this.generationLoading = false;
      this.modal.close();
    };
  }

  get generationAvailable(): boolean {
    return (
      this.property.startsWith("book.") &&
      this.generation &&
      (this.type === FieldType.enum.input || this.type === FieldType.enum.textarea)
    );
  }

  get propertyId(): string {
    return this.property.replace(/\./g, "-");
  }

  get value(): string | number {
    const context = this.getContext();
    // this.property is something like "title" or "model.text.name"
    if (!context) return "";
    const properties = this.contextualProperty.split(".");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let value: any = context;
    for (const prop of properties) {
      value = value ? value[prop] : undefined;
    }
    if (this.type === FieldType.enum.number) {
      return value || 0;
    }
    return value || "";
  }

  getContext(): AppConfig | Book | Chapter | undefined {
    if (this.property.startsWith("app.")) {
      return this.appContext.app;
    } else if (this.property.startsWith("book.")) {
      return this.bookContext.book;
    } else if (this.property.startsWith("chapter.")) {
      return this.chapterContext.chapter;
    }
    dispatch(this, WarningEvent(`Unknown property context for ${this.property}`));
    throw new Error(`Unknown property context for ${this.property}`);
  }

  get contextualProperty(): string {
    if (this.property.startsWith("app.")) {
      return this.property.split("app.")[1];
    } else if (this.property.startsWith("book.")) {
      return this.property.split("book.")[1];
    } else if (this.property.startsWith("chapter.")) {
      return this.property.split("chapter.")[1];
    }
    throw new Error(`Unknown property context for ${this.property}`);
  }

  save(): (event: CustomEvent | InputEvent) => void {
    return (event: CustomEvent | InputEvent): void => {
      const value = this.getValueFromEvent(event);

      if (this.min !== undefined && typeof value === "number" && value < this.min) {
        this.invalid = true;
        return;
      }

      if (this.max !== undefined && typeof value === "number" && value > this.max) {
        this.invalid = true;
        return;
      }

      this.invalid = false;

      if (value === undefined) return;
      if (this.property.startsWith("app.")) {
        const app = buildNestedObject(AppConfigPartial, this.contextualProperty, value);
        this.appContext.app = mergeAppProperties(this.appContext.app!, app);
        this.debounceHandler.debounce(() => {
          updateAppService.fetch({ app });
          dispatch(this, SaveEvent());
        });
      } else if (this.property.startsWith("book.")) {
        const book = buildNestedObject(BookPartial, this.contextualProperty, value);
        this.bookContext.book = mergeBookProperties(this.bookContext.book!, book);
        this.debounceHandler.debounce(() => {
          updateBookService.fetch({
            book,
            name: this.bookContext.book!.id,
          });
          dispatch(this, SaveEvent());
        });
      } else if (this.property.startsWith("chapter.")) {
        const chapter = {
          ...buildNestedObject(ChapterPartial, this.contextualProperty, value),
          number: this.chapterContext.chapter!.number,
        };
        this.chapterContext.chapter = {
          ...this.chapterContext.chapter!,
          ...chapter,
        };
        this.debounceHandler.debounce(() => {
          updateChapterService.fetch({
            book: this.bookContext.book!.id,
            chapter,
          });
          dispatch(this, SaveEvent());
        });
      }
    };
  }

  getValueFromEvent(event: CustomEvent | InputEvent): string | number | boolean | undefined {
    const target = event.target as HTMLInputElement | HTMLTextAreaElement;
    switch (this.type) {
      case FieldType.enum.input:
        return (event.target as HTMLInputElement).value;
      case FieldType.enum.number:
        return Number((event.target as HTMLInputElement).value);
      case FieldType.enum.textarea:
        return (event as CustomEvent).detail.value;
      case FieldType.enum.boolean:
        return (target as HTMLInputElement).checked;
      default:
        throw new Error(`Unknown field type: ${this.type}`);
    }
  }

  resize(): void {
    const shadow = this.shadowRoot;
    if (!shadow) return;
    const textarea = shadow.querySelector<InklifyAutoTextarea>(".field inklify-auto-textarea");
    if (textarea) {
      textarea.adjustHeight();
    }
  }
}
