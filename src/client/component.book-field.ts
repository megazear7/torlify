import { css, html, LitElement, TemplateResult } from "lit";
import { customElement, property } from "lit/decorators.js";
import { globalStyles } from "./styles.global.js";
import { consume } from "@lit/context";
import { bookContext, BookContext } from "./context.book.js";
import { LoadingStatus } from "../shared/type.loading.js";
import { SaveEvent } from "./event.save.js";
import { dispatch } from "./util.events.js";
import { updateBookService } from "../shared/service.update-book.js";
import { DebounceHandler } from "./util.debounce.js";
import { buildNestedObject } from "../shared/util.property.js";
import { BookPartial } from "../shared/type.book.js";
import { mergeBookProperties } from "../shared/util.merge-book.js";

@customElement("torlify-book-field")
export class TorlifyBookField extends LitElement {
  static override styles = [globalStyles, css``];

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
      <label for="${this.propertyId}">${this.labelWithFallback()}</label>
      <input type="text" id="${this.propertyId}" .value="${this.value}" @input=${this.save()} />
    `;
  }

  number(): TemplateResult {
    return html`
      <label for="${this.propertyId}">${this.labelWithFallback()}</label>
      <input type="number" id="${this.propertyId}" .value="${this.value}" @input=${this.save()} />
    `;
  }

  textarea(): TemplateResult {
    return html`
      <torlify-auto-textarea
        heading="${this.heading}"
        .value="${this.value}"
        @input="${this.save()}"></torlify-auto-textarea>
    `;
  }

  boolean(): TemplateResult {
    return html`
      <torlify-checkbox
        .checked="${!!this.value}"
        on=${this.labelWithFallback()}
        off=${this.labelWithFallback()}
        @change=${this.save()}></torlify-checkbox>
    `;
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

  get propertyId(): string {
    return this.property.replace(/\./g, "-");
  }

  get value(): string | number {
    // this.property is something like "title" or "model.text.name"
    const book = this.bookContext.book;
    if (!book) return "";
    const properties = this.property.split(".");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let value: any = book;
    for (const prop of properties) {
      value = value ? value[prop] : undefined;
    }
    if (this.type === "number") {
      return value || 0;
    }
    return value || "";
  }

  save(): (event: CustomEvent | InputEvent) => void {
    return (event: CustomEvent | InputEvent): void => {
      const value = this.getValueFromEvent(event);
      if (value === undefined) return;
      const book = buildNestedObject(BookPartial, this.property, value);
      this.bookContext.book = mergeBookProperties(this.bookContext.book!, book);
      this.debounceHandler.debounce(() => {
        updateBookService.fetch({
          book,
          name: this.bookContext.book!.id,
        });
        dispatch(this, SaveEvent());
      });
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
