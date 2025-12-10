import { css, html, LitElement, TemplateResult } from "lit";
import { customElement, property } from "lit/decorators.js";
import { globalStyles } from "./styles.global.js";
import { consume } from "@lit/context";
import { AppContext, appContext, BookContext, bookContext } from "./context.js";
import { LoadingStatus } from "../shared/type.loading.js";
import { SaveEvent } from "./event.save.js";
import { dispatch } from "./util.events.js";
import { DebounceHandler } from "./util.debounce.js";
import { Book, BookPartial } from "../shared/type.book.js";
import { AppConfig, AppConfigPartial } from "../shared/type.app.js";
import { buildNestedObject } from "../shared/util.property.js";
import { mergeBookProperties } from "../shared/util.merge-book.js";
import { updateBookService } from "../shared/service.update-book.js";
import { mergeAppProperties } from "../shared/util.merge-app.js";
import { updateAppService } from "../shared/service.update-app.js";
import { infoIcon } from "./icons.js";

@customElement("torlify-field")
export class TorlifyField extends LitElement {
  static override styles = [
    globalStyles,
    css`
      label {
        display: flex;
        align-items: center;
        gap: var(--size-small);
        color: var(--color-primary-text);
        margin-bottom: var(--size-small);
      }

      label .field-help {
        display: flex;
        align-items: center;
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

  @property({ type: String })
  public type: "input" | "textarea" | "number" | "boolean" = "input";

  @property({ type: String })
  public property: string = "";

  @property({ type: String })
  public label: string = "";

  @property({ type: String })
  public help: string = "";

  @property({ type: String })
  public heading: "h2" | "" = "";

  private debounceHandler = new DebounceHandler();

  override render(): TemplateResult {
    switch (this.type) {
      case "input":
        return this.input();
      case "number":
        return this.number();
      case "textarea":
        return this.textarea();
      case "boolean":
        return this.boolean();
    }
  }

  input(): TemplateResult {
    return html`
      <label for="${this.propertyId}">${this.labelWithFallback()}${this.renderHelp()}</label>
      <input type="text" id="${this.propertyId}" .value="${this.value}" @input=${this.save()} />
    `;
  }

  number(): TemplateResult {
    return html`
      <label for="${this.propertyId}">${this.labelWithFallback()}${this.renderHelp()}</label>
      <input type="number" id="${this.propertyId}" .value="${this.value}" @input=${this.save()} />
    `;
  }

  textarea(): TemplateResult {
    return html`
      ${this.renderHelp()}
      <torlify-auto-textarea
        heading="${this.heading}"
        .value="${this.value}"
        @input="${this.save()}"></torlify-auto-textarea>
    `;
  }

  boolean(): TemplateResult {
    return html`
      ${this.renderHelp()}
      <torlify-checkbox
        .checked="${!!this.value}"
        text=${this.labelWithFallback()}
        @change=${this.save()}></torlify-checkbox>
    `;
  }

  renderHelp(): TemplateResult {
    if (this.help) {
      return html`
        <span class="field-help" title=${this.help}>${infoIcon}</span>
      `;
    }
    return html``;
  }

  labelWithFallback(): TemplateResult {
    if (this.label)
      return html`
        <span>${this.label}</span>
      `;
    // Derive label from property
    const parts = this.property.split(".");
    const lastPart = parts[parts.length - 1];
    // Convert camelCase or snake_case to Title Case
    const title = lastPart
      .replace(/([A-Z])/g, " $1")
      .replace(/_/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
    return html`
      <span>${title}</span>
    `;
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
    if (this.type === "number") {
      return value || 0;
    }
    return value || "";
  }

  getContext(): AppConfig | Book | undefined {
    return this.property.startsWith("book.") ? this.bookContext.book : this.appContext.app;
  }

  get contextualProperty(): string {
    return this.property.startsWith("book.") ? this.property.split("book.")[1] : this.property.split("app.")[1];
  }

  save(): (event: CustomEvent | InputEvent) => void {
    return (event: CustomEvent | InputEvent): void => {
      const value = this.getValueFromEvent(event);
      if (value === undefined) return;
      if (this.property.startsWith("book.")) {
        const book = buildNestedObject(BookPartial, this.contextualProperty, value);
        this.bookContext.book = mergeBookProperties(this.bookContext.book!, book);
        this.debounceHandler.debounce(() => {
          updateBookService.fetch({
            book,
            name: this.bookContext.book!.id,
          });
          dispatch(this, SaveEvent());
        });
      } else {
        const app = buildNestedObject(AppConfigPartial, this.contextualProperty, value);
        this.appContext.app = mergeAppProperties(this.appContext.app!, app);
        this.debounceHandler.debounce(() => {
          updateAppService.fetch({ app });
          dispatch(this, SaveEvent());
        });
      }
    };
  }

  getValueFromEvent(event: CustomEvent | InputEvent): string | number | boolean | undefined {
    const target = event.target as HTMLInputElement | HTMLTextAreaElement;
    switch (this.type) {
      case "input":
        return (event.target as HTMLInputElement).value;
      case "number":
        return Number((event.target as HTMLInputElement).value);
      case "textarea":
        return (event as CustomEvent).detail.value;
      case "boolean":
        return (target as HTMLInputElement).checked;
    }
  }
}
