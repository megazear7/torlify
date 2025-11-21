import { consume } from "@lit/context";
import { css, html, LitElement, TemplateResult } from "lit";
import { customElement, property, query } from "lit/decorators.js";
import { BookContext, bookContext } from "./context.book.js";
import { LoadingStatus } from "../shared/type.loading.js";
import { globalStyles } from "./styles.global.js";
import { BookReference, ReferenceUse } from "../shared/type.book.js";
import { dispatch } from "./util.events.js";
import { UpdateBookEvent } from "./event.update-book.js";
import { buildNestedObject } from "../shared/util.property.js";
import { BookPartial } from "../shared/type.book.js";
import { plusIcon, trashIcon, editIcon } from "./icons.js";
import { TorlifyModal } from "./component.modal.js";
import { uploadReferenceService } from "../shared/service.upload-reference.js";

@customElement("torlify-references")
export class TorlifyReferences extends LitElement {
  static override styles = [
    globalStyles,
    css`
      .references-container {
        margin-top: var(--size-xl);
      }

      .references-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: var(--size-medium);
      }

      .references-title {
        font-size: var(--font-medium);
        font-weight: 600;
        color: var(--color-primary-text);
      }

      .add-button {
        background: var(--color-secondary-surface);
        color: var(--color-secondary-text);
        border: none;
        border-radius: var(--radius-medium);
        padding: var(--size-small) var(--size-medium);
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: var(--size-small);
        font-size: var(--font-small);
        transition: var(--transition-all);
      }

      .add-button:hover {
        background: var(--color-2);
        transform: var(--transform-hover);
      }

      .references-list {
        display: flex;
        flex-direction: column;
        gap: var(--size-medium);
      }

      .reference-item {
        background: var(--color-secondary-surface);
        border-radius: var(--radius-medium);
        padding: var(--size-medium);
        display: flex;
        align-items: center;
        justify-content: space-between;
        border: 1px solid transparent;
        transition: var(--transition-all);
      }

      .reference-item:hover {
        box-shadow: var(--shadow-hover);
      }

      .reference-info {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: var(--size-small);
      }

      .reference-file {
        font-size: var(--font-medium);
        font-weight: 500;
        color: var(--color-primary-text);
      }

      .reference-meta {
        font-size: var(--font-small);
        color: var(--color-secondary-text);
      }

      .reference-when-to-use {
        display: flex;
        flex-wrap: wrap;
        gap: var(--size-small);
        margin-top: var(--size-medium);
      }

      .reference-tag {
        background: var(--color-secondary-surface-active);
        padding: var(--size-small);
        border-radius: var(--radius-medium);
        box-shadow: var(--shadow-normal);
        font-size: var(--font-tiny);
        font-weight: 500;
        text-transform: uppercase;
      }

      .reference-actions {
        display: flex;
        gap: var(--size-small);
      }

      .action-button {
        background: none;
        border: none;
        color: var(--color-secondary-text);
        cursor: pointer;
        padding: var(--size-small);
        border-radius: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: var(--transition-all);
      }

      .action-button:hover {
        background: var(--color-secondary-surface-active);
        color: var(--color-primary-text);
      }

      .edit-button:hover {
        background: var(--color-2);
        color: white;
      }

      .remove-button:hover {
        background: var(--color-error);
        color: white;
      }

      .empty-state {
        text-align: center;
        color: var(--color-secondary-text);
        font-style: italic;
        padding: var(--size-xl);
        background: var(--color-secondary-surface);
        border-radius: var(--radius-medium);
        border: 2px dashed var(--color-border);
      }

      .modal-body {
        display: flex;
        flex-direction: column;
        gap: var(--size-large);
      }

      .form-group {
        display: flex;
        flex-direction: column;
        gap: var(--size-small);
      }

      .form-label {
        font-weight: 500;
        color: var(--color-primary-text);
      }

      .form-input {
        width: 100%;
        padding: var(--size-medium);
        border: 1px solid var(--color-border);
        border-radius: var(--radius-medium);
        background: var(--color-primary-surface);
        color: var(--color-primary-text);
        transition: var(--transition-all);
      }

      .form-input:focus {
        outline: none;
        border-color: var(--color-accent);
        box-shadow: var(--shadow-active);
      }

      .form-textarea {
        width: 100%;
        padding: var(--size-medium);
        border: 1px solid var(--color-border);
        border-radius: var(--radius-medium);
        background: var(--color-primary-surface);
        color: var(--color-primary-text);
        resize: vertical;
        transition: var(--transition-all);
      }

      .form-textarea:focus {
        outline: none;
        border-color: var(--color-accent);
        box-shadow: var(--shadow-active);
      }

      .checkbox-group {
        display: flex;
        flex-wrap: wrap;
        gap: var(--size-small);
      }

      .checkbox-label {
        display: flex;
        align-items: center;
        gap: var(--size-small);
        cursor: pointer;
        padding: var(--size-small);
        border-radius: var(--radius-small);
        transition: var(--transition-all);
      }

      .checkbox-label:hover {
        background: var(--color-secondary-surface-active);
      }

      .checkbox-text {
        text-transform: capitalize;
      }

      .file-info {
        font-size: var(--font-small);
        color: var(--color-secondary-text);
        margin-top: var(--size-small);
      }
    `,
  ];

  @consume({ context: bookContext, subscribe: true })
  @property({ attribute: false })
  public bookContext: BookContext = {
    status: LoadingStatus.enum.idle,
  };

  @query("torlify-modal") modal!: TorlifyModal;
  @query('input[type="file"]') fileInput!: HTMLInputElement;

  private editingIndex: number | null = null;
  private editingReference: BookReference | null = null;
  private selectedFile: File | null = null;

  override render(): TemplateResult {
    const references = this.bookContext.book?.references || [];

    return html`
      <div class="references-container">
        <div class="references-header">
          <h4 class="references-title">References</h4>
          <button class="add-button" @click="${this.addReference}">
            ${plusIcon} Add Reference
          </button>
        </div>

        ${references.length === 0
          ? html`
              <div class="empty-state">
                No references added yet. Click "Add Reference" to get started.
              </div>
            `
          : html`
              <div class="references-list">
                ${references.map(
                  (reference, index) => html`
                    <div class="reference-item">
                      <div class="reference-info">
                        <div class="reference-file">${reference.file}</div>
                        <div class="reference-meta">
                          ${reference.instructions
                            ? html`<div>${reference.instructions}</div>`
                            : html`<div>No instructions provided</div>`}
                          <div class="reference-when-to-use">
                            ${reference.whenToUse.map(
                              (use) => html`
                                <span class="reference-tag">${use}</span>
                              `,
                            )}
                          </div>
                        </div>
                      </div>
                      <div class="reference-actions">
                        <button
                          class="action-button edit-button"
                          @click="${(): void => this.editReference(index)}"
                          title="Edit reference"
                        >
                          ${editIcon}
                        </button>
                        <button
                          class="action-button remove-button"
                          @click="${(): void => this.removeReference(index)}"
                          title="Remove reference"
                        >
                          ${trashIcon}
                        </button>
                      </div>
                    </div>
                  `,
                )}
              </div>
            `}
      </div>

      <torlify-modal
        .title="${this.editingIndex !== null
          ? "Edit Reference"
          : "Add Reference"}"
        @ModelSubmit="${this.handleModalSubmit}"
      >
        <div slot="body">${this.renderModalContent()}</div>
        <button slot="submit-button" class="standard-button">
          ${this.editingIndex !== null ? "Update Reference" : "Add Reference"}
        </button>
      </torlify-modal>
    `;
  }

  private renderModalContent(): TemplateResult {
    return html`
      <div class="modal-body">
        <div class="form-group">
          <label class="form-label">Reference File</label>
          <input
            class="form-input"
            type="file"
            @change="${(e: Event): void =>
              this.handleFileSelect(e.target as HTMLInputElement)}"
            accept=".txt,.md,.pdf,.doc,.docx"
          />
          ${this.editingReference?.file
            ? html`<div class="file-info">
                Selected: ${this.editingReference.file}
              </div>`
            : html`<div class="file-info">No file selected</div>`}
        </div>

        <div class="form-group">
          <label class="form-label">Instructions</label>
          <textarea
            class="form-textarea"
            .value="${this.editingReference?.instructions}"
            @input="${(e: Event): string =>
              (this.editingReference!.instructions = (
                e.target as HTMLTextAreaElement
              ).value)}"
            placeholder="Instructions for using this reference"
            rows="3"
          ></textarea>
        </div>

        <div class="form-group">
          <label class="form-label">When to Use</label>
          <div class="checkbox-group">
            ${ReferenceUse.options.map(
              (option) => html`
                <label class="checkbox-label">
                  <input
                    type="checkbox"
                    .checked="${this.editingReference?.whenToUse.includes(
                      option,
                    )}"
                    @change="${(e: Event): void =>
                      this.toggleWhenToUse(
                        option,
                        (e.target as HTMLInputElement).checked,
                      )}"
                  />
                  <span class="checkbox-text">${option}</span>
                </label>
              `,
            )}
          </div>
        </div>
      </div>
    `;
  }

  private addReference(): void {
    this.editingIndex = null;
    this.editingReference = {
      file: "",
      instructions: "",
      whenToUse: [],
    };
    this.selectedFile = null;
    if (this.fileInput) {
      this.fileInput.value = "";
    }
    this.modal.open();
  }

  private editReference(index: number): void {
    const references = this.bookContext.book?.references || [];
    this.editingIndex = index;
    this.editingReference = { ...references[index] };
    this.selectedFile = null;
    if (this.fileInput) {
      this.fileInput.value = "";
    }
    this.modal.open();
  }

  private removeReference(index: number): void {
    const currentReferences = this.bookContext.book?.references || [];
    const newReferences = currentReferences.filter((_, i) => i !== index);

    const updateData = buildNestedObject(
      BookPartial,
      "references",
      newReferences,
    );
    dispatch(this, UpdateBookEvent(updateData));
  }

  private toggleWhenToUse(option: ReferenceUse, checked: boolean): void {
    if (!this.editingReference) return;

    if (checked) {
      this.editingReference.whenToUse = [
        ...this.editingReference.whenToUse,
        option,
      ];
    } else {
      this.editingReference.whenToUse = this.editingReference.whenToUse.filter(
        (use) => use !== option,
      );
    }
  }

  private async handleModalSubmit(): Promise<void> {
    console.log("A");
    if (!this.editingReference || !this.selectedFile) {
      this.modal.close();
      this.editingIndex = null;
      this.editingReference = null;
      this.selectedFile = null;
      return;
    }
    console.log("B");

    try {
      // Upload the file
      const uploadResult = await uploadReferenceService.fetch({
        book: this.bookContext.book!.id,
        filename: this.selectedFile.name,
        file: this.selectedFile,
      });
      console.log("C");

      if (uploadResult.success) {
        // Add/update the reference in the book
        const currentReferences = this.bookContext.book?.references || [];
        let newReferences: BookReference[];

        if (this.editingIndex !== null) {
          // Update existing reference
          newReferences = currentReferences.map((ref, index) =>
            index === this.editingIndex ? this.editingReference! : ref,
          );
        } else {
          // Add new reference
          newReferences = [...currentReferences, this.editingReference!];
        }

        const updateData = buildNestedObject(
          BookPartial,
          "references",
          newReferences,
        );
        dispatch(this, UpdateBookEvent(updateData));
      }
    } catch (error) {
      console.error("Failed to upload reference file:", error);
      // TODO: Show error message to user
    }

    // Clean up
    this.modal.close();
    this.editingIndex = null;
    this.editingReference = null;
    this.selectedFile = null;
  }

  private handleFileSelect(input: HTMLInputElement): void {
    const file = input.files?.[0] || null;
    this.selectedFile = file;
    if (this.editingReference && file) {
      this.editingReference.file = file.name;
    }
    this.requestUpdate();
  }
}
